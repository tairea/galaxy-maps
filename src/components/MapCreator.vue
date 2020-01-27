<template>
    
        <b-tabs type="is-boxed">
            <b-tab-item>
                <template slot="header">
                    <b-icon icon="numeric-1"></b-icon>
                    <span> What is an operating system? <b-tag rounded> 3 </b-tag> </span>
                </template>
            </b-tab-item>
            <b-tab-item>
                <template slot="header">
                    <b-icon icon="numeric-2"></b-icon>
                    <span> File Management <b-tag rounded> 2 </b-tag> </span>
                </template>
            </b-tab-item>
        </b-tabs>
    </template>

<script>
    import Vue from 'vue'
    import {db} from "./firebaseInit";
    import {firestorePlugin} from 'vuefire'
    import Buefy from 'buefy'
    import 'buefy/dist/buefy.css'

    Vue.use(firestorePlugin)
    Vue.use(Buefy)

    export default {
		name: 'MapCreator',
        components: {
            
        },
        props: [],
		data() {
            return {

            }
        },
        computed: {
            baseSteps() {
                return [
                    {
                        label: 'Branch',
                        content: 'Lorem ipsum dolor sit amet.',
                        displayed: true,
                    },
                    {
                        label: 'Topic',
                        content: 'Lorem ipsum dolor sit amet.',
                        displayed: true,
                    },
                    {
                        label: 'Exercises',
                        content: 'Lorem ipsum dolor sit amet.',
                        displayed: true,
                    }
                ]
            },
            steps() {
                const steps = [...this.baseSteps]
                // if (this.showBooks) {
                //     steps.splice(steps.length - 1, 0, this.bookStep);
                // }
                return steps
            },
        },
        mounted() {

        },
        methods: {

        }
    }
</script>