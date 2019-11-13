<template>
    <div id="taiohi-panel">
        
        <div class="profile-container">
            <img id="profile-pic" v-bind:src="require('@/assets/student_photos/meelah.png')" />
        </div>
        <div class="text-container">
            <h3>1300</h3>
            <h4>XP</h4>
        </div>

        <TwentyFirstSkills/>

    </div>


</template>

<script>
	import Vue from 'vue'
	import {db} from "./firebaseInit";
    import {firestorePlugin} from 'vuefire'
    
    import TwentyFirstSkills from "./TwentyFirstSkills.vue";

	Vue.use(firestorePlugin)

	export default {
		name: 'TaiohiPanel',
        props: {},
        components: {
            TwentyFirstSkills
        },
		data() {
			return {

			}
		},
		firestore: {
            
		},
		watch: {

		},
		computed: {

		},
		mounted() {
        
        },
		methods: {

		}
	}
</script>



<style scoped>

	#taiohi-panel {
		width: 20%;
		height: 100%;
		/* background-color: lightgrey; */
		z-index: 999;
	}

	.text-container {
		color: #2ed573;
		margin-top: 30px;
	}

	.text-container h3 {
		font-size: 1.5em
	}

	.text-container h4 {
		font-size: 1.7em
	}


	.profile-container {
		margin-top: 50px;
		width: 100%;
	}

	#profile-pic {
		width: 50%;
		border-radius: 50%;
		object-fit: cover;
		background-color: #2c3e50;
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