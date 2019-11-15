import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

import GalaxyMap from "./components/GalaxyMap.vue";
import SubGalaxyMap from "./components/SubGalaxyMap.vue";

Vue.use(VueRouter);

const routes = [
  {path: "/", component: GalaxyMap},
  {path: "/map/:nodeId", component: SubGalaxyMap}
]

const router = new VueRouter({
  routes: routes,
  mode: "history"
})

Vue.config.productionTip = false

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
