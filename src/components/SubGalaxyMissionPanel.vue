<template>
    <div id="mission-panel" v-if="nodeinfo != null">
		<div style="display: flex; justify-content: space-between; width: 100%;">
			<h1 style="font-size: 2.5em; padding: 10px 25px;">{{exercise.exercise}}</h1>
			<h3 style="display:flex; justify-content: center; align-items: center; padding-right: 25px;">{{exercise.kaitiaki}}</h3>
		</div>
		<div style="display: flex;">
			<div v-for="task in exercise.tasks" :key="task.index" class="objective-card" :class="{ 'green': completedTasks[exercise.tasks.indexOf(task)] }">
				<h2>Objective {{exercise.tasks.indexOf(task)}}:</h2>
					{{task}}
				<input type="checkbox" :name="task.index" v-model="completedTasks[exercise.tasks.indexOf(task)]">
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
        props: ['nodeid', 'parentnodeid', 'studentid'],
		data() {
			return {
				nodeinfo: [],
				exercise: '',
				student: '',
				studentsExercise: '',
				completedTasks: []
			}
		},
		firestore: {
            
		},
		watch: {
           nodeid: {
			   handler: "nodeIdUpdated"
		   },
		   completedTasks: {
			   handler: "taskUpdated"
		   }
		},
		computed: {

		},
		mounted() {
			
        },
		methods: {
			taskTest() {
				console.log("watcher " + this.completedTasks)
			},
            nodeIdUpdated() {
				this.$bind("nodeinfo",db.collection("galaxy/tech/nodes/" + this.parentnodeid + "/nodes/").doc(this.nodeid));
				this.$bind("exercise",db.collection("exercises/").doc(this.nodeid));
				this.$bind("studentsExercise",db.collection("students/" + this.studentid + "/galaxyMapsUnlocked/").doc(this.nodeid))
				.then(() => {
					// sync completedTasks with database tasksCompleted
					this.completedTasks = this.studentsExercise.tasksCompleted
				});
			},
			taskUpdated() {
				let totalTasks = this.exercise.tasks.length

				console.log("syncing this to db:")
				console.log(this.completedTasks)

				// sync change to firebase db
				db.collection("students/" + this.studentid + "/galaxyMapsUnlocked/").doc(this.nodeid).set({
					totalTasks: totalTasks,
					tasksCompleted: this.completedTasks
				})
				.then(function() {
					console.log("Document successfully written!");
				})
				.catch(function(error) {
					console.error("Error writing document: ", error);
				});

				/*
				// confirm tasks all are checked
				var ticked = document.querySelectorAll('input[type=checkbox]:checked')
				if (ticked.length == this.exercise.tasks.length) {
					console.log("completed")
				}
				*/
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

	.green {
		background-color: #c0ffb3;
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