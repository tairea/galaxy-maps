<template>
	<div class="galaxymap">
		<!-- <svg id="svgCanvas" viewbox="0 0 2000 1000" preserveaspectratio="xMinYMin slice" width="100%" height="100%" >
			<g id="starGroup"></g>
		</svg> -->
		<div id="mynetwork"></div>
	</div>
</template>

<script>
import vis from 'vis-network'
import Vue from 'vue'
import { db } from "./firebaseInit";
import { firestorePlugin } from 'vuefire'
import { STAR_DATA } from "./stars";

Vue.use(firestorePlugin)

export default {
	name: 'GalaxyMap',
	props: {},
	data() {
		return {
			galaxy: [],
			nodes: [],
			edges:[],
			// nodes: [
			// 	{id: 1, label: 'Node 1', value: 100, url: "test01.html"},
			// 	{id: 2, label: 'Node 2', value: 200, url: "test02.html"},
			// 	{id: 3, label: 'Node 3', value: 300, url: "test03.html"},
			// 	{id: 4, label: 'Node 4', value: 400, url: "test04.html"},
			// 	{id: 5, label: 'Node 5', value: 500, url: "test05.html"}
			// ],
			// edges: [
			// 	{from: 1, to: 3},
			// 	{from: 1, to: 2},
			// 	{from: 2, to: 4},
			// 	{from: 2, to: 5}
			// ],
			options: {
                manipulation: {
                    enabled: false,
                    initiallyActive: false,
                    addEdge: function(edgeData, callback) {
                        callback(edgeData);
                    }
                },
                nodes: {
					physics: true,
					shape: 'dot',
					size: 5,
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
				layout: {
					randomSeed: 15,
					improvedLayout:true,
				},
				edges: {
					color: {
						color:'#ffffff',
						highlight:'#1e90ff',
						hover: '#2ed573',
						inherit: 'from',
						opacity: 0.3
					},
					scaling:{
						min: 1,
						max: 15,
						label: {
							enabled: true,
							min: 14,
							max: 30,
							maxVisible: 30,
							drawThreshold: 5
						},
						customScalingFunction: function (min,max,total,value) {
							if (max === min) {
							return 0.5;
							}
							else {
							var scale = 1 / (max - min);
							return Math.max(0,(value - min)*scale);
							}
						}
					},
					// length: 100,
					// smooth: {
					// 	enabled: true,
					// 	// type: "dynamic",
					// 	// roundness: 0.5
					// },
				},
				interaction: {
					dragNodes :true,
					navigationButtons: true, // these need some more CSS
					keyboard: true
				},
				// read the docs for this
				physics: {
					barnesHut: {
					avoidOverlap: 1,
					gravitationalConstant: -3300,
					springLength: 150,
					},
					minVelocity: 0.75,
					timestep: 0.9,

					stabilization: {
						enabled:true,
						iterations:1000,
						updateInterval:25
					}               
				},
            },
            container: '',
            network: null
		}
	},
	firestore: {
		// nodes: db.collection("galaxy/tech/nodes"),
		// edges: db.collection("galaxy/tech/edges")
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
		
		// this.$bind("nodes",db.collection('galaxy/tech/nodes')).then(function() {
		// 	console.log("nodes binded")
		// 	console.log(this.nodes)
		// });


		// this.$bind("edges",db.collection('galaxy/tech/edges')).then(function() {
		// 	console.log("edges binded")
		// 	console.log(this.edges)
		// });

		/*=====================================================
       		get node & edges data from firestore database
		=====================================================*/

		db.collection("galaxy").get().then((querySnapshot) => {
			var nodeArray = [];

			querySnapshot.forEach((doc) => {

			if (doc.id == "nodes") {
				nodeArray = Object.values(doc.data())
			}
			})
			console.log("nodes doc data:")
			console.log(nodeArray)
			// this.nodes = nodeArray
			var edgeArray = [];
			querySnapshot.forEach((doc) => {
			if (doc.id == "edges") {
				edgeArray = Object.values(doc.data())
			}
			})
			console.log("edges doc data:")
			console.log(edgeArray)
			// this.edges = edgeArray;

			// this.network.setData({
			// 	nodes: nodeArray,
			// 	edges: edgeArray
			// })

			// this.network.redraw();

			this.container = document.getElementById('mynetwork');
			this.network = new vis.Network(this.container, {
				nodes: nodeArray,
				edges: edgeArray
			}, this.options);

		});


		// this.container = document.getElementById('mynetwork');
		// this.network = new vis.Network(this.container, this.graph_data, this.options);

		// this.network.setData({
		// 	nodes: nodeArray,
		// 	edges: edgeArray
		// })

		// this.network.redraw();


		/*=====================================================
       					node click events
		=====================================================*/

		//add click event to nodes
		// this.network.on( 'click', function(properties) {
		// 	console.log(properties);
		// });

		// this.network.on("selectNode", function (params) {
		// 	var selectedNodeId = params.nodes[0];
		// 	var node = this.network.body.nodes[selectedNodeId];
		// 	node.setOptions({
		// 		font: {
		// 			size: 20
		// 		},
		// 		size: 20,
		// 	});
		// });

		// this.network.on("deselectNode", function (params) {
		// 	var deselectedNodeId = params.previousSelection.nodes[0];
		// 	var node = this.network.body.nodes[deselectedNodeId];
		// 	node.setOptions({
		// 		font: {
		// 			size: this.options.nodes.font.size
		// 		},
		// 		size: this.options.nodes.size,
		// 	});
		// });


		/*=====================================================
       					space looking stuff
		=====================================================*/

		// credit: Georgios Kaleadis
		// source: https://www.satellytes.com/blog/twinkling-night-sky-with-shooting-stars-made-in-svg/
		function createStar({x, y}, index, debug) {
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
		}

		function createNightSky({container, debug}) {
			STAR_DATA.forEach((data, index) => {
				const star = createStar(data, index, debug);
				container.appendChild(star);
			})
		}
		
		const starGroup = document.getElementById('starGroup');

		createNightSky({container: starGroup, data: STAR_DATA});

	},
	methods: {

	}
}

</script>

<style>
* {
	margin: 0 !important;
	padding: 0 !important;
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
  z-index:1;
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

<style scoped>

.galaxymap {
	width: 100vw;
	height: 100vh;
	margin: 0;

	/* background-image: linear-gradient( 100deg,  rgba(0,0,0,1) 20%, rgba(53,92,125,1) 180.8% ); */
		
	background: #141E30;  
	background: -webkit-linear-gradient(135deg, #141E30 60%, #243B55 150%);  
	background: linear-gradient(85deg, #141E30 60%, #243B55 150%); 
	
}

#mynetwork {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
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