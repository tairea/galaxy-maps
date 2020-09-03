<template>
	<div id="galaxymap">
		<!-- <svg id="svgCanvas" viewbox="0 0 2000 1000" preserveaspectratio="xMinYMin slice" width="100%" height="100%" >
			<g id="starGroup"></g>
		</svg> -->

		<KaitiakiPanel :teacher="teachers[0]"/>

		<!-- MANIPULATION ADDON -->
		<div id="network-popUp">
			<span id="operation">node</span> <br />
			<table style="margin:auto;">
				<tbody>
				<tr>
					<td>id</td>
					<td><input id="node-id" value="new value" /></td>
				</tr>
				<tr>
					<td>label</td>
					<td><input id="node-label" value="new value" /></td>
				</tr>
				</tbody>
			</table>
			<input type="button" value="save" id="saveButton" />
			<input type="button" value="cancel" id="cancelButton" />
		</div>

		<!-- vis network graph (galaxy map) -->
		<div id="mynetwork"></div>

		<div class="mission-panel-container">
			<GalaxyMissionPanel ></GalaxyMissionPanel>
		</div>

	</div>
</template>

<script>
	import vis from 'vis-network'
	import Vue from 'vue'
	import firebase from "firebase";
	import {db} from "./firebaseInit";
	import {firestorePlugin} from 'vuefire'
	// import {STAR_DATA} from "./stars";

	import KaitiakiPanel from "./KaitiakiPanel.vue";
	import GalaxyMissionPanel from "./GalaxyMissionPanel.vue";

	Vue.use(firestorePlugin)

	export default {
		name: 'KaitiakiMap',		
		components: {
			KaitiakiPanel,
			GalaxyMissionPanel
		},
		props: [],
		data() {
			return {
				currentUser: null,
				teachers: [],
				// student: null,
				loadedStudents: false,
				studentIsLoaded: false,
				clickednodeid: '',
				studentUnlocked: [],
				container: '',
				network: null,
				galaxy: [],
				nodes: [],
				edges: [],
				options: {
					physics: {

						"repulsion": {
							"centralGravity": 0,
							"springLength": 300,
							"springConstant": 0.35,
							"nodeDistance": 490
						},
						"maxVelocity": 24,
						"minVelocity": 0.23,
						"solver": "repulsion"
					},
					layout: {
						randomSeed: 12,
						improvedLayout: true,
					},
					nodes: {
						physics: true,
						shape: 'dot',
						size: 15,
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
					manipulation: 
					{
						addNode: function(data, callback) {
							// filling in the popup DOM elements
							document.getElementById("operation").innerHTML = "Add Node";
							document.getElementById("node-id").value = data.id;
							document.getElementById("node-label").value = data.label;
							document.getElementById("saveButton").onclick = function(data,callback) {
								data.id = document.getElementById("node-id").value;
								data.label = document.getElementById("node-label").value;
								
								// clearPopUp();
								document.getElementById("saveButton").onclick = null;
								document.getElementById("cancelButton").onclick = null;
								document.getElementById("network-popUp").style.display = "none";

								callback(data);
							};
							document.getElementById("cancelButton").onclick = function() {
								document.getElementById("saveButton").onclick = null;
								document.getElementById("cancelButton").onclick = null;
								document.getElementById("network-popUp").style.display = "none";
							};
							document.getElementById("network-popUp").style.display = "block";
						},
						editNode: function(data, callback) {
							// filling in the popup DOM elements
							document.getElementById("operation").innerHTML = "Edit Node";
							document.getElementById("node-id").value = data.id;
							document.getElementById("node-label").value = data.label;
							document.getElementById("saveButton").onclick = function(data,callback) {
								data.id = document.getElementById("node-id").value;
								data.label = document.getElementById("node-label").value;
								clearPopUp();
								callback(data);
							}; 
							document.getElementById("cancelButton").onclick = this.cancelEdit(callback);
							document.getElementById("network-popUp").style.display = "block";
						},
						addEdge: function(data, callback) {
							if (data.from == data.to) {
							var r = confirm("Do you want to connect the node to itself?");
							if (r == true) {
								callback(data);
							}
							} else {
							callback(data);
							}
						}
					}
				},
			}
		},
		firestore: {
			nodes: db.collection("galaxy/tech/nodes"),
			edges: db.collection("galaxy/tech/edges"),
		},
		watch: {
			nodes: {
				handler: "renderGalaxyMap",
				deep: true
			},
			edges: {
				handler: "renderGalaxyMap",
				deep: true
			},
			currentUser(user) {
				this.$bind(
					"teachers",
					db.collection("teachers").where("email", "array-contains", user.email)
					// studentsDb.orderBy("school_year")
				);
			},
			teachers(teachers) {
				console.log("user has access to:", teachers);
				this.$set(this, "loadedStudents", true);
				this.renderGalaxyMap();
			}
		},
		computed: {
			graph_data() {
				this.nodes.forEach(element => {
					element.hidden = false;
				});
				return {
					nodes: new vis.DataSet(this.nodes),
					edges: new vis.DataSet(this.edges)
				}
			}
		},
		mounted() {
			this.$set(this, "currentUser", firebase.auth().currentUser);
			// eslint-disable-next-line
			console.log("user is:", firebase.auth().currentUser.displayName);


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

			renderGalaxyMap() {

				/*================================================
					wait to get node & edges & student data from firestore
				================================================*/
				if (this.graph_data.nodes.length == 0 || this.graph_data.edges.length == 0 || this.loadedStudents == false) {
					return;
				}

				//unhide all nodes for TEACHER MODE
				console.log("all nodes")

				



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
					
					//check it see if node clicked is a 'topic' type node. if it is, route to its page
					if (params.nodes[0].includes("top")) {
						this.$router.push({ path: "/map/"+params.nodes[0]})
					}

					//get id of clicked node to prop into Galaxy Mission Panel component
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
			},

			logout: function() {
				firebase
					.auth()
					.signOut()
					.then(() => {
					alert("signed out");
					this.$router.go({ path: this.$router.path });
					});
			},

			unlockNode($event) {
				let idToUnlock = $event
				console.log("unlocking: " + idToUnlock)

				//TODO: unlock more than one topic based on if their dependency is the branch.

				// update node to hidden:false (only on client side)
				this.graph_data.nodes.update({
								id: idToUnlock, 
								hidden: false, 
								physics: true,
								shape: 'dot', 
								size: 15,
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
							})

				// this.$unbind("nodes", false)

				
				// hide mission panel
				// var missionPanelElem = document.querySelector(".mission-panel-container")
				// missionPanelElem.classList.toggle("show");
			},

			// MANIUPLATION FUNCTIONS
			clearPopUp() {
				document.getElementById("saveButton").onclick = null;
				document.getElementById("cancelButton").onclick = null;
				document.getElementById("network-popUp").style.display = "none";
			},
			cancelEdit(callback) {
				clearPopUp();
				callback(null);
			},
			saveData(data, callback) {
				data.id = document.getElementById("node-id").value;
				data.label = document.getElementById("node-label").value;
				clearPopUp();
				callback(data);
			}
		}
	}
</script>

<style>
	div.vis-network div.vis-edit-mode {
		left: initial !important;
		right: 0 !important;
	}

	div.vis-network div.vis-manipulation {
		width: auto;
		left: initial;
		right: 0;
	}
</style>



<style scoped>
	#galaxymap {
		display: flex;
		width: 100vw;
		height: 100vh;
		margin: 0;
		background: #141E30;
		background: -webkit-linear-gradient(135deg, #141E30 60%, #243B55 150%);
		background: linear-gradient(85deg, #141E30 60%, #243B55 150%);
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


	/* MANIPULATION ADDON */
	table.legend_table {
	font-size: 11px;

	}
	table.legend_table,
	td {

	padding: 2px;
	}
	div.table_content {
	width: 80px;
	text-align: center;
	}
	div.table_description {
	width: 100px;
	}

	#operation {
	font-size: 28px;
	}
	#network-popUp {
	display: none;
	position: absolute;
	top: 350px;
	left: 170px;
	z-index: 299;
	width: 250px;
	height: 120px;
	background-color: #f9f9f9;
	padding: 10px;
	text-align: center;
	}

</style>