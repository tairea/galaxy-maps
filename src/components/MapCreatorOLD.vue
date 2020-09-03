<template>
        <div id="app">
            <span>{{ msg }}</span>

            <div v-for="branch in nodes" :key="branch.key" style="margin-top: 100px;">
                <ul>
                    <li v-for="topnode in branch.tops" v-bind:class="getLevel(topnode.type)" :key="topnode.key">
                        <span class="flex">
                            <b-tag v-if="topnode.type == 'Branch'" type="is-info">{{branch.type}}</b-tag>
                            <p class="label">{{branch.label}}</p>
                        </span>
                        <ul>
                            <li v-for="topnode in branch.tops" v-bind:class="getLevel(topnode.type)" :key="topnode.key">
                                <span class="flex">
                                    <b-tag
                                        v-if="topnode.type == 'Exam Major' || topnode.type == 'NZQA Assessment' || topnode.type == 'Topic' || topnode.type == 'Project Major'"
                                        type="is-success">
                                        <p @contextmenu.prevent="$refs.menu.open">{{topnode.type}}</p>
                                    </b-tag>
                                    <p class="label">{{topnode.label}}</p>
                                </span>
                                <ul>
                                    <li v-for="subnode in topnode.subs" v-bind:class="getLevel(topnode.type)"
                                        :key="subnode.key">
                                        <span class="flex">
                                            <b-tag type="is-primary">
                                                {{subnode.type}}
                                            </b-tag>
                                            <p class="label">{{subnode.label}}</p>
                                        </span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                </ul>
            </div>

            <vue-context ref="menu">
                <li>
                    <a @click.prevent="onClick($event.target.innerText)">
                        <b-tag type="is-success">Topic</b-tag>
                    </a>
                </li>
                <li>
                    <a @click.prevent="onClick($event.target.innerText)">
                        <b-tag type="is-warning">Exam</b-tag>
                    </a>
                </li>
            </vue-context>
    
            <b-tabs type="is-boxed" style="margin-top: 300px;">
                <b-tab-item>
                    <template slot="header">
                        <b-icon icon="numeric-1"></b-icon>
                        <span> What is an operating system? <b-tag rounded> 3 </b-tag> </span>
                    </template>
                    <ul>
                        <li v-for="branch in nodes" :key="branch.key" style="margin-bottom: 30px; font-weight:bold">{{branch.label}}
                            <ul>
                                <li v-for="topnode in branch.tops" :key="topnode.key" style="font-size: 0.9em">{{"Type:" + topnode.type + " - " + "Name: " + topnode.label}}
                                    <ul>
                                        <li v-for="subnode in topnode.subs" :key="subnode.key" style="font-size: 0.8em">{{subnode.type + " " + subnode.label}}</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </b-tab-item>
                <b-tab-item>
                    <template slot="header">
                        <b-icon icon="numeric-2"></b-icon>
                        <span> File Management <b-tag rounded> 2 </b-tag> </span>
                    </template>
                </b-tab-item>
            </b-tabs>
        </div>
    </template>
    
    <script>
        import Vue from 'vue';
        import Buefy from 'buefy'
        import 'buefy/dist/buefy.css'
        
        import { focus } from 'vue-focus';
        import { VueContext } from 'vue-context';
    
        import firebase from "firebase";
        import { db } from "./firebaseInit";
        import { firestorePlugin } from 'vuefire'
    
        Vue.use(Buefy)
    
        const MAX_LEVEL = 10;
    
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
                    list: [{
                            value: 'The first line',
                            level: 0
                        },
                        {
                            value: 'The second line',
                            level: 1
                        },
                        {
                            value: 'The third line',
                            level: 2
                        },
                    ],
                    focused: null
                }
            },
            firestore: {
                // nodes: db.collection("galaxy/tech/nodes"),
            },
            computed: {
            },
            methods: {
                moveDown: function () {
                    this.focused = Math.min(this.focused + 1, this.list.length - 1);
                },
                moveUp: function () {
                    this.focused = Math.max(this.focused - 1, 0);
                },
                shiftLeft: function (index, event) {
                    let self = this;
                    self.list[index].level = Math.max(self.list[index].level - 1, 0);
                },
                shiftRight: function (index, event) {
                    if (event.shiftKey)
                        return;
                    if (index === 0) return;
                    this.list[index].level = Math.min(this.list[index].level + 1, this.list[index - 1].level + 1,
                        MAX_LEVEL);
                },
                addItem: function (index) {
                    this.list.splice(index + 1, 0, {
                        value: '',
                        level: this.list[index].level
                    });
                    this.focused = index + 1;
                },
                getLevel(type) {
                    if (type == "Branch") {
                        return 'level0'
                    } else {
                        return 'level1'
                    }
                }
                
            },
            async created() {
                    // Get reference to all of the documents
                    console.log("Retrieving list of documents in collection... and remapping");
                    let documents = await db.collection("galaxy/tech/nodes").get();
    
                    let obj = {}
                    let branchId = ''
    
                    documents.forEach(async doc => {
                        // console.log("Parent Document ID: ", doc.id);
                        
                        // if this node is a branch, create obj
                        if (doc.id.includes("bra")) {
                            obj = {
                                prefix: doc.data().id.substring(0, 3),
                                id: doc.data().id,
                                label: doc.data().label,
                                type: doc.data().group,
                                tops: {},
                            }
                            this.nodesObj[doc.id] = obj
                        } 
    
                        // if this node is not a branch, but part of current obj branch join to obj.tops
                        else {
                            // create topic object
                            let topObj = {
                                id: doc.data().id,
                                label: doc.data().label,
                                type: doc.data().group,
                                subs: []
                            }
    
                            // find branch name using this node.id
                            branchId = doc.data().id.substring(0, 7);
                            branchId += "bra"
                            this.nodesObj[branchId].tops[doc.data().id] = topObj
                        }
                        
    
                        let subCollectionDocs = await db.collection("galaxy/tech/nodes").doc(doc.id).collection("nodes").get()
                        
                        subCollectionDocs.forEach(subCollectionDoc => {
                            // console.log("Sub Collection ID: ", subCollectionDoc.id);

                            let subObj = {
                                id: subCollectionDoc.data().id,
                                label: subCollectionDoc.data().label,
                                type: subCollectionDoc.data().group
                            }
                            let subbranchId = subCollectionDoc.data().id.substring(0, 7);
                            subbranchId += "bra"
                            let topicId = subCollectionDoc.data().id.substring(0, 13);
                            this.nodesObj[subbranchId].tops[topicId].subs.push(subObj)
                        });
                        // this.nodesObj[branchId].tops = Object.values(this.nodesObj[branchId].tops)
                        const result = Object.keys(this.nodesObj[branchId].tops).map(i => this.nodesObj[branchId].tops[i])
                        console.log(result)

                        
                    })
                    
                    this.nodes = Object.values(this.nodesObj)
                    console.log("this.nodes")
                    console.log(this.nodes)
                }
        }
    </script>
    
    <style scoped lang="scss">
        @import '~vue-context/src/sass/vue-context';
    
        $maxLevel: 10;
    
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
    
        @for $i from 0 through $maxLevel {
            li.level#{$i} {
                margin-left: 20px * $i;
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
    
    
    /*
    <ul style="margin-top: 50px;">
        <li v-for="(item, index) in list" v-bind:class="`level${list[index].level}`" :key="item.key">
            <span>
                <b-tag v-if="list[index].level == 0" type="is-info">Branch</b-tag>
                <b-tag v-else-if="list[index].level == 1" type="is-success">
                    <p @contextmenu.prevent="$refs.menu.open">Topic</p>
                </b-tag>
                <b-tag v-else-if="list[index].level == 2" type="is-primary">
                    <p>Exercise</p>
                </b-tag>
                <b-tag v-else-if="list[index].level == 3" type="is-primary">Exercise</b-tag>
            </span>
            <input v-model="list[index].value" @keydown.down.prevent.exact="moveDown"
                @keydown.up.prevent.exact="moveUp" @keydown.tab.prevent.exact="shiftRight(index, $event)"
                @keydown.shift.tab.prevent.exact="shiftLeft(index, $event)"
                @keydown.enter.prevent.exact="addItem(index)" v-focus="index === focused" @focus="focused = index"
                @blur="focused = null">
        </li>
    </ul>


----


<div v-for="branch in nodes" :key="branch.key">
                <ul style="margin-top: 50px;">
                    <li v-for="topnode in branch.tops" v-bind:class="getLevel(topnode.type)" :key="topnode.key">
                        <span>
                            <b-tag v-if="topnode.type == 'Branch'" type="is-info">{{branch.type}}</b-tag>
                            <p>{{branch.label}}</p>
                        </span>
                        <ul>
                            <li v-for="topnode in branch.tops" v-bind:class="getLevel(topnode.type)" :key="topnode.key">
                                <span>
                                    <b-tag
                                        v-if="topnode.type == 'Exam Major' || topnode.type == 'NZQA Assessment' || topnode.type == 'Topic' || topnode.type == 'Project Major'"
                                        type="is-success">
                                        <p @contextmenu.prevent="$refs.menu.open">{{topnode.type}}</p>
                                    </b-tag>
                                    <p>{{topnode.label}}</p>
                                </span>
                                <ul>
                                    <li v-for="subnode in topnode.subs" v-bind:class="getLevel(topnode.type)"
                                        :key="subnode.key">
                                        <span>
                                            <b-tag type="is-primary">
                                                <p>{{subnode.type}}</p>
                                            </b-tag>
                                            <p>{{subnode.label}}</p>
                                        </span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                </ul>
            </div>

    */
    
    </style>

    