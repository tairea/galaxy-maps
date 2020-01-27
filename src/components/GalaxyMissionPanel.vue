<template>
    <div id="mission-panel" v-if="nodeinfo != null">
        <h1>Mission Panel</h1>
        <br>
        <br>
        <h3>{{nodeid}}</h3>
		<h3>{{nodeinfo.label}}</h3>
		<button @click="unlockTopic">Start {{nodeinfo.label}}</button>
    </div>
</template>

<script>
	import Vue from 'vue'
	import {db} from "./firebaseInit";
    import {firestorePlugin} from 'vuefire'
    
	Vue.use(firestorePlugin)

	export default {
		name: 'GalaxyMissionPanel',
        components: {
            
        },
        props: ['nodeid'],
		data() {
			return {
                nodeinfo: [],
			}
		},
		firestore: {
            
		},
		watch: {
           nodeid: {
			   handler: "nodeIdUpdated"
           }
		},
		computed: {

		},
		mounted() {

        },
		methods: {
            nodeIdUpdated() {
                this.$bind("nodeinfo",db.collection("galaxy/tech/nodes/").doc(this.nodeid));
			},
			unlockTopic() {
				let nextTopicNodeId = this.nodeid.replace("bra", "top.01")
				console.log("node to unlock is: " + nextTopicNodeId)
				this.$emit('unlockNode', nextTopicNodeId)
				
				// update firebase to nextTopicNodeId: {hidden: false}
				// db.collection("galaxy/tech/nodes/").doc(nextTopicNodeId).update({hidden: false}).then(function() {
				// 	console.log("Document successfully written!");
				// })
			}
		}
	}
</script>



<style scoped>

	#mission-panel {
		width: 100%;
		height: 100%;
		/* background-color: lightgrey; */
		z-index: 999;
	}

	button {
		margin-top: 50px;
		background-color: orange;
		padding: 20px;
		font-size: 1.1em;
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
</style>