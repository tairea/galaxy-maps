<template>
	<div id="topicmap">
		<!-- <svg id="svgCanvas" viewbox="0 0 2000 1000" preserveaspectratio="xMinYMin slice" width="100%" height="100%" >
			<g id="starGroup"></g>
		</svg> -->

		<!-- student panel -->
		<!-- <TaiohiPanel></TaiohiPanel> -->

		<h1>{{$route.params.nodeId}}</h1>

		<!-- vis network graph (topic map) -->
		<div id="mynetwork"></div>

		<div class="mission-panel-container">
			<SubGalaxyMissionPanel v-bind:nodeid="clickednodeid" :parentnodeid="parentNodeId"></SubGalaxyMissionPanel>
		</div>

	</div>
</template>

<script>
	import vis from 'vis-network'
	import Vue from 'vue'
	import {db} from "./firebaseInit";
	import {firestorePlugin} from 'vuefire'
	import {STAR_DATA} from "./stars";

	// import TaiohiPanel from "./TaiohiPanel.vue";
	import SubGalaxyMissionPanel from "./SubGalaxyMissionPanel.vue";

	Vue.use(firestorePlugin)

	export default {
		name: 'SubGalaxyMap',		
		components: {
			// TaiohiPanel,
			SubGalaxyMissionPanel
		},
		props: [],
		data() {
			return {
				parentNodeId: this.$route.params.nodeId,
				nodeinfo: [],
				clickednodeid: '',
				container: '',
				network: null,
				galaxy: [],
				nodes: [],
				edges: [],
				options: {
					// manipulation: {
					//     enabled: true,
					//     initiallyActive: true,
					//     addEdge: function(edgeData, callback) {
					//         callback(edgeData);
					//     }
					// },
					physics: {
						"barnesHut": {
						"gravitationalConstant": -28400,
						"centralGravity": 1.15,
						"springLength": 135,
						"springConstant": 0.36,
						"damping": 0.1,
						"avoidOverlap": 1
						},
						"maxVelocity": 34,
						"minVelocity": 0.95
					},
					layout: {
						// randomSeed: 68,
						improvedLayout: true,
					},
					nodes: {
						physics: true,
						shape: 'dot',
						size: 15,
						color: {
							// border: '#ffffff',
							// background: '#f1f2f6',
							// highlight: {
							// 	border: '#70a1ff',
							// 	background: '#1e90ff'
							// },
							// hover: {
							// 	border: '#7bed9f',
							// 	background: '#2ed573'
							// }
						},
						font: {
							color: '#ffffff',
							size: 25, // px
							face: 'arial',
							background: 'none',
							strokeWidth: 0, // px
							strokeColor: '#ffffff',
							align: 'center',
							multi: false,
							vadjust: 0,
							bold: {
								color: '#343434',
								size: 14, // px
								face: 'arial',
								vadjust: 0,
								mod: 'bold'
							},
						}
					},
					edges: {
						color: {
							color: '#ffffff',
							highlight: '#1e90ff',
							hover: '#2ed573',
							inherit: 'from',
							opacity: 0.3
						},
						// length: 200,
						smooth: {
							type: 'dynamic',
							roundness: 0,
						}
					},
					groups: {
						Start: {
							color: {
								background: '#57606f'
							},
							font: {
								color: '#ffffff',
								bold: {
									color: '#343434',
									size: 18, // px
									face: 'arial',
									vadjust: 0,
									mod: 'bold'
								},
							},
							borderWidth: 0
						}
					},
					interaction: {
						dragNodes: true,
						navigationButtons: true, // these need some more CSS
						keyboard: true,
						tooltipDelay: 3600000,
					},

					// configure: {
					// 	enabled: true,
					// 	filter: function (option, path) {
					// 				return path.indexOf('physics') !== -1;
					// 			},
					// 	// container: document.getElementById("settings"),
					// 	showButton: true
					// }

				},
			}
		},
		watch: {
			nodes: {
				handler: "renderGalaxyMap",
				deep: true,
			},
			edges: {
				handler: "renderGalaxyMap",
				deep: true,
			},
			'$route': {
			   handler: "nodeIdUpdated",
			   immediate: true,
           	},
		},
		computed: {
			graph_data() {
				return {
					nodes: this.nodes,
					edges: this.edges
				}
			}
		},
		mounted() {

			/*=====================================================
       					space looking stuff
			=====================================================*/
			// credit: Georgios Kaleadis
			// source: https://www.satellytes.com/blog/twinkling-night-sky-with-shooting-stars-made-in-svg/
			/*
			const starGroup = document.getElementById('starGroup');
			this.createNightSky({container: starGroup, data: STAR_DATA});
			*/

		},
		methods: {
			nodeIdUpdated() {
				console.log("this.route.params.nodeId = " + this.$route.params.nodeId)
				this.$bind("nodes",db.collection("galaxy/tech/nodes/" + this.$route.params.nodeId + "/nodes/"));
				this.$bind("edges",db.collection("galaxy/tech/nodes/" + this.$route.params.nodeId + "/edges/"));
            },

			renderGalaxyMap() {

				/*================================================
					wait to get node & edges data from firestore
				================================================*/
				if (this.graph_data.nodes.length == 0 || this.graph_data.edges.length == 0) {
					return;
				}

				console.log(this.graph_data)

				/*================================================
							render galaxy map
				================================================*/
				this.container = document.getElementById('mynetwork');
				this.network = new vis.Network(this.container, this.graph_data, this.options);

				var missionPanelElem = document.querySelector(".mission-panel-container")


				/*================================================
							node click events
				================================================*/
				
				this.network.on("selectNode", (params) => {

					//get id of clicked node to prop into Sub Mission Panel component
					this.clickednodeid = params.nodes[0];
					console.log("clicked: " + this.clickednodeid)
					
					// zoom on clicked node
					var options = {
						scale: 1, 
						locked: true, 
						animation: {
							duration: 2000,
							easing: "easeInOutQuart"
							}
					}
					this.network.focus(params.nodes[0],options)

					// show mission panel when node is clicked
					missionPanelElem.classList.toggle("show");

				});

				// zoom out when nodes not selected
				this.network.on("click", (params) => {
					if (params.nodes == 0) {
						this.network.fit({animation: true})
					}
				});

				// hide mission panel when node deselected
				this.network.on("deselectNode", (params) => {
					missionPanelElem.classList.toggle("show");
				});

				//change color style when clicked
				// var nodeID = params['nodes']['0'];
				// if (nodeID) {
				// 	var clickedNode = nodes.get(nodeID);
				// 	clickedNode.color = {
				// 	border: '#000000',
				// 	background: '#000000',
				// 	highlight: {
				// 		border: '#2B7CE9',
				// 		background: '#D2E5FF'
				// 	}
				// 	}
				// 	nodes.update(clickedNode);
				// }
			},

			createNightSky({
				container,
				debug
			}) {
				STAR_DATA.forEach((data, index) => {
					const star = this.createStar(data, index, debug);
					container.appendChild(star);
				})
			},
			createStar({
				x,
				y
			}, index, debug) {
				const starInstance = document.createElementNS("http://www.w3.org/2000/svg", 'g');
				starInstance.classList.add('star-instance');
				starInstance.setAttribute('transform', `translate(${x} ${y})`);

				const radius = debug ? 10 : 1;
				const starReference = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

				starReference.setAttribute('r', radius);
				starReference.classList.add('star');

				const delay = index * 100 + 500 * Math.random();

				const duration = 3000 + Math.random() * 4000;
				const brightness = 0.7 + Math.random() * 0.3;

				starReference.style.setProperty('--star-animation-delay', `${delay}ms`);
				starReference.style.setProperty('--star-animation-duration', `${duration}ms`);
				starReference.style.setProperty('--star-animation-glow-duration', `10000ms`);
				starReference.style.setProperty('--star-brightness', `${brightness}`);

				starInstance.appendChild(starReference);
				return starInstance;
			},
		}
	}
</script>



<style scoped>
	#topicmap {
		width: 100vw;
		height: 100vh;
		margin: 0;
		background: #141E30;
		background: -webkit-linear-gradient(135deg, #141E30 60%, #243B55 150%);
		background: linear-gradient(85deg, #141E30 60%, #243B55 150%);

		display: flex;
	}

	#mynetwork {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
	}

	.mission-panel-container {
		width: 25%;
		height: 100%;
		background-color: rgb(245, 245, 245);
		position: absolute;
		transition: all 0.5s;
		top: 0;
		right: -30%;
	}

	.mission-panel-container.show {
		right: 0%;
	}


	h3 {
		margin: 40px 0 0;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #42b983;
	}
</style>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	#app {
		margin: 0 !important;
	}

	.stars {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	#btnDebug {
		position: fixed;
		z-index: 1;
		top: 10px;
		left: 10px;
	}

	.star {
		fill: white !important;
		animation: pulse var(--star-animation-duration, 1000ms) infinite backwards,
			glowing var(--star-animation-glow-duration, 1000ms) infinite alternate backwards;
		animation-delay: var(--star-animation-delay, 0);
	}

	#starGroup {
		--dur: 100ms;
	}

	@keyframes pulse {
		0% {
			transform: scale3d(1, 1, 1);
		}

		30% {
			transform: scale3d(1.2, 1.2, 1.2);
		}

		70% {
			transform: scale3d(0.2, 0.2, 0.2);
		}

		100% {
			transform: scale3d(1, 1, 1);
		}
	}

	div.vis-network div.vis-navigation div.vis-button.vis-up,
	div.vis-network div.vis-navigation div.vis-button.vis-down,
	div.vis-network div.vis-navigation div.vis-button.vis-left,
	div.vis-network div.vis-navigation div.vis-button.vis-right,
	div.vis-network div.vis-navigation div.vis-button.vis-zoomIn,
	div.vis-network div.vis-navigation div.vis-button.vis-zoomOut,
	div.vis-network div.vis-navigation div.vis-button.vis-zoomExtends {
		background-image: none !important;
	}

	div.vis-network div.vis-navigation div.vis-button:hover {
		box-shadow: none !important;
	}

	.vis-button:after {
		font-size: 2em;
		color: gray;
	}

	.vis-button:hover:after {
		font-size: 2em;
		color: lightgray;
	}

	.vis-button.vis-up:after {
		content: "▲";
	}

	.vis-button.vis-down:after {
		content: "▼";
	}

	.vis-button.vis-left:after {
		content: "◀";
	}

	.vis-button.vis-right:after {
		content: "▶";
	}

	.vis-button.vis-zoomIn:after {
		content: "+";
		font-weight: bold;
	}

	.vis-button.vis-zoomOut:after {
		content: "−";
		font-weight: bold;
	}

	.vis-button.vis-zoomExtends:after {
		content: "⤧";
	}
</style>