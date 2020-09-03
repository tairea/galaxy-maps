<template>
    <div id="taiohi-panel">
        
        <div class="profile-container">
			<img
				v-if="teacher.given_name"
				id="profile-pic"
				v-bind:src="require('@/assets/staff_photos/' + formatTeacherName(teacher.given_name) + '.png')"
			/>
			<img v-else  id="profile-pic" v-bind:src="require('@/assets/student_photos/placeholder-avatar.png')" />
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
		name: 'KaitiakiPanel',
        props: ["teacher"],
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
			formatTeacherName: function(name) {
				name = name.replace(/\s/g, "");
				return name.toLowerCase();
			}
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
		display: flex;
		justify-content: center;
		align-items: center;
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