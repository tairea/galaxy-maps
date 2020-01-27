import Vue from 'vue';
import VueRouter from 'vue-router';

import GalaxyMap from "@/components/GalaxyMap.vue";
import SubGalaxyMap from "@/components/SubGalaxyMap.vue";
import Login from "@/components/Login.vue";
import MapCreator from "@/components/MapCreator.vue";

Vue.use(VueRouter);

const routes = [
    {path: "/", component: GalaxyMap},
    {path: "/map/:nodeId", component: SubGalaxyMap},
    {path: "/login", component: Login},
    {path: "/creator", component: MapCreator},
]

const router = new VueRouter({
  routes: routes,
  mode: "history"
})

//Nav Guards
router.beforeEach((to, from, next) => {
    //check for requiredAuth guard
    if (to.matched.some(record => record.meta.requiresAuth)) {
      //check if NOT logged in
      if (!firebase.auth().currentUser) {
        // Go the login
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        const user = firebase.auth().currentUser;
        if (to.path === '/' && teacherEmails.some((x) => x === user.email)) {
          // Go to teacher
          next({
            path: '/dashboard'
          });
        }
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      //check if IS logged in
      if (firebase.auth().currentUser) {
        // Go the login
        next({
          path: '/',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        // proceed to the route
        next()
      }
    } else {
      // proceed to the route
      next()
    }
  })
  
  export default router;
  
  