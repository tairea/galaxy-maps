<template>
    <div id="mission-panel" v-if="nodeinfo != null">
        <h1>Mission Panel</h1>
        <br>
        <br>
        <h3>{{nodeid}}</h3>
        <h3>{{nodeinfo.label}}</h3>
    </div>
</template>

<script>
	import Vue from 'vue'
	import {db} from "./firebaseInit";
    import {firestorePlugin} from 'vuefire'
    
	Vue.use(firestorePlugin)

	export default {
		name: 'MissionPanel',
        components: {
            
        },
        props: ['nodeid', 'parentnodeid'],
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
				this.$bind("nodeinfo",db.collection("galaxy/tech/nodes/" + this.parentnodeid + "/nodes/").doc(this.nodeid));
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