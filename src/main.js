import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import { firestorePlugin } from "vuefire";

Vue.config.productionTip = false

Vue.use(firestorePlugin);

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      render: h => h(App)
    })
  }
})