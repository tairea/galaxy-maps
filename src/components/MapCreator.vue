<template>

    <div>

        <h1>Branch</h1>

        <!-- COLLAPSE CARD -->
        <section class="collpaseCard" style="margin: 20px;  ">
            <b-collapse class="card" aria-id="contentIdForA11y3">
                <div
                    slot="trigger" 
                    slot-scope="props"
                    class="card-header"
                    role="button"
                    aria-controls="contentIdForA11y3">
                    <p class="card-header-title">
                        Exercise 1
                    </p>
                    <a class="card-header-icon">
                        <b-icon icon="faCaretUp">
                            <!-- :icon="props.open ? 'menu-down' : 'faCaretUp'"> -->
                        </b-icon>
                    </a>
                </div>
                <div class="card-content">
                    <div class="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                        <a>#buefy</a>.
                    </div>
                </div>
                <footer class="card-footer">
                    <a class="card-footer-item">Save</a>
                    <a class="card-footer-item">Edit</a>
                    <a class="card-footer-item">Delete</a>
                </footer>
            </b-collapse>
        </section>

    </div>


</template>
    
<script>
    import Vue from 'vue';

    
    import { focus } from 'vue-focus';
    import { VueContext } from 'vue-context';

    import firebase from "firebase";
    import { db } from "./firebaseInit";
    import { firestorePlugin } from 'vuefire'

    import { library } from '@fortawesome/fontawesome-svg-core';
    
    import { faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,
        faArrowUp, faAngleRight, faAngleLeft, faAngleDown,
        faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

    library.add(faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,
        faArrowUp, faAngleRight, faAngleLeft, faAngleDown,
        faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload);
    Vue.component('vue-fontawesome', FontAwesomeIcon);

    import Buefy from 'buefy'
    import 'buefy/dist/buefy.css'


    Vue.use(Buefy, {
        // defaultIconComponent: 'vue-fontawesome',
        defaultIconPack: 'fas',
    });
    

    export default {
        name: 'app',
        directives: {
            focus: focus
        },
        components: {
            VueContext
        },
        data() {
            return {
                nodesObj: {},
                nodes: [],
                msg: 'Map Creator',
            }
        },
        firestore: {
            // nodes: db.collection("galaxy/tech/nodes"),
        },
        computed: {
        },
        methods: {
            
            
        },
        async created() {
                
            }
    }
</script>
    
<style scoped lang="scss">


    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
        margin-left: 100px;
    }

    h1,
    h2 {
        font-weight: normal;
    }

    ul {
        padding: 0;
        list-style-type: none;
    }

    li {
        margin: 5px;

        p {
            /* width: 90%;
            border: 0px;
            outline: none; */
            margin-left: 10px;
        }
    }
    a {
        color: #42b983;
    }

    .flex {
        display: flex;
        /* justify-content: center; */
        align-items: center;
    }

    .label {
        font-size: 0.8em;
        font-weight: normal;
    }
</style>

    