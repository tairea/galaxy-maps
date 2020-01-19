<template>
    <div id="mission-panel" v-if="nodeinfo != null">
		<div style="display: flex; justify-content: space-between; width: 100%;">
			<h1 style="font-size: 2.5em; padding: 10px 25px;">{{exercise.exercise}}</h1>
			<h3 style="display:flex; justify-content: center; align-items: center; padding-right: 25px;">{{exercise.kaitiaki}}</h3>
		</div>
		<div style="display: flex;">
			<div v-for="task in exercise.tasks" :key="task.index" class="objective-card">
				<h2>Objective {{exercise.tasks.indexOf(task)}}:</h2>
				{{task}}
				<input type="checkbox" :name="task.index" value="exericse.exerciseId + '.obj.' + task.index">
			</div>
		</div>
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
				exercise: '',
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
				this.$bind("exercise",db.collection("exercises/").doc(this.nodeid));
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

	.objective-card {
		margin: 25px;
		height: 300px;

		border: 0.5px solid #ccc;
		border-radius: 15px;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	input {
		width: 30px;
		height: 30px;
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