<template>
    <div id="mission-panel">
        <h1>Mission Panel</h1>
        <br>
        <br>
        <h3>{{nodeid}}</h3>
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
        props: ['nodeid'],
		data() {
			return {
                clickednode: this.nodeid
			}
		},
		firestore: {
            
		},
		watch: {
            nodeid: function() {
                console.log("node id is (from mission panel): " + this.nodeid)
            },
		},
		computed: {

		},
		mounted() {
            console.log("from mission panel: " + this.nodeid)
        
        },
		methods: {

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