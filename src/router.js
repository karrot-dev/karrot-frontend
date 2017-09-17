import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'

import store from '@/store'

import Home from '@/components/Home.vue'
import GroupDetailContainer from '@/components/GroupDetailContainer.vue'
import Error404 from '@/components/Error404.vue'
import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'
import { getter } from '@/store/helpers'

Vue.use(VueRouter)
Vue.use(Meta)

let isLoggedIn = getter('auth/isLoggedIn')

export const protectRoute = (to, from, next) => {
  if (isLoggedIn()) {
    next()
  }
  else {
    let { name, params } = to
    store.dispatch('auth/setRedirectTo', { name, params })
    next({ name: 'login' })
  }
}

export const redirectIfLoggedIn = (to, from, next) => {
  if (isLoggedIn()) {
    next({ name: 'index' })
  }
  else {
    next()
  }
}

const router = new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */
  linkActiveClass: 'TEST',
  routes: [
    { name: 'index', path: '/', redirect: '/group/1', beforeEnter: protectRoute },
    { name: 'home', path: '/home', component: Home },
    { name: 'group', path: '/group/:groupId', component: GroupDetailContainer, beforeEnter: protectRoute },
    { name: 'login', path: '/login', component: Login, beforeEnter: redirectIfLoggedIn },
    { name: 'signup', path: '/signup', component: Signup },

    // Always leave this last one
    { path: '*', component: Error404 }, // Not found
  ],
})

sync(store, router)

export default router
