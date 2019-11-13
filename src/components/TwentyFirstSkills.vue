<template>
    <div id="twentycskills">
        <table style="position: relative; width: 500px; left: 130px;">
            <tr>
                <td class="skillcell1">
                    <img title="Literacy" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/1-literacy.png')" />
                </td>
                <td class="skillcell2">
                    <div class="progressbar literacybar" style="width: 120px"></div>
                    <p class="twentycskillpoints literacy">1200</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1">
                    <img title="Numeracy" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/2-numeracy.png')" />
                </td>
                <td style="display: flex; align-items: center">
                    <div class="progressbar literacybar" style="width: 70px"></div>
                    <p class="twentycskillpoints literacy">700</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Scientific Literacy" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/3-scientific.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar literacybar" style="width: 25px"></div>
                    <p class="twentycskillpoints literacy">250</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="ICT Literacy" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/4-ict.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar literacybar" style="width: 120px"></div>
                    <p class="twentycskillpoints literacy">1200</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Financial Literacy" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/5-financial.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar literacybar" style="width: 66px"></div>
                    <p class="twentycskillpoints literacy">660</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Cultural and Civic Literacy" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/6-cultural.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar literacybar" style="width: 84px"></div>
                    <p class="twentycskillpoints literacy">845</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Problem Solving" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/7-problemsolving.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar competencybar" style="width: 25px"></div>
                    <p class="twentycskillpoints competency">250</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Creativity" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/8-creativity.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar competencybar" style="width: 120px"></div>
                    <p class="twentycskillpoints competency">1200</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Communication" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/9-communication.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar competencybar" style="width: 92px"></div>
                    <p class="twentycskillpoints competency">920</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Collaboration" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/10-collaboration.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar competencybar" style="width: 46px"></div>
                    <p class="twentycskillpoints competency">465</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Curiosity" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/11-curiosity.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar characteristicsbar"  style="width: 9px"></div>
                    <p class="twentycskillpoints characteristics">90</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Initiative" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/12-initiative.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar characteristicsbar" style="width: 51px"></div>
                    <p class="twentycskillpoints characteristics">510</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Persistence" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/13-persistence.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar characteristicsbar" style="width: 39px"></div>
                    <p class="twentycskillpoints characteristics">390</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Adaptability" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/14-adaptability.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar characteristicsbar" style="width: 18px"></div>
                    <p class="twentycskillpoints characteristics">180</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Leadership" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/15-leadership.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar characteristicsbar" style="width: 70px"></div>
                    <p class="twentycskillpoints characteristics">700</p>
                </td>
            </tr>
            <tr>
                <td class="skillcell1"><img title="Social and Cultural Awareness" class="twentycskillicon"
                        v-bind:src="require('@/assets/21cs/16-socialawareness.png')" /></td>
                <td class="skillcell2">
                    <div class="progressbar characteristicsbar" style="width: 100px"></div>
                    <p class="twentycskillpoints characteristics">1000</p>
                </td>
            </tr>

        </table>
    </div>
</template>

<script>
    import Vue from 'vue'
    
	import {db} from "./firebaseInit";
	import {firestorePlugin} from 'vuefire'
	Vue.use(firestorePlugin)

	export default {
		name: 'TwentyFirstSkills',
        props: {},
        components: {

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
	
	/*================= 21 century skills */

	#twentycskills {
		width: 100%;
		margin-top: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	table {
		width: 30%;
		/* border-collapse:separate;  */
		/* border-spacing: 0 1em; */
	}

	tr {
		margin: 1em 0;
		text-align: left;
	}

	td {
		text-align: left;
	}

	.skillcell1 {
		width: 60px;
		text-align: center;
	}

	.twentycskillicon {
		width: 30%;
	}

	.skillcell2 {
		display: flex;
		align-items: center;
	}

	.progressbar {
		opacity: 0.7;
		height: 3px;
		width: 120px
	}

	.twentycskillpoints {
		font-size: 0.6em;
		margin-left: 10px;
	}

	.literacybar {background-color: #a042a2}
	.competencybar {background-color: #ff8a26}
	.characteristicsbar {background-color: #019cd5}

	.literacy {
		color: #a042a2
	}

	.competency {
		color: #ff8a26
	}

	.characteristics {
		color: #019cd5
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