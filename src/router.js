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
import Stores from '@/pages/Stores.vue'
import Settings from '@/pages/Settings.vue'
import User from '@/pages/User.vue'
import StoreDetail from '@/pages/StoreDetail.vue'
import PickupFeedback from '@/pages/Feedback.vue'
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
   * 
   * BREADCRUMBS - Available types:
   *  - activeGroup
   *  - activeStore
   * ...you can define other ones in KBreadcrumb.
   */
  linkActiveClass: 'TEST',
  routes: [
    { name: 'index', path: '/', redirect: '/group/1', beforeEnter: protectRoute },
    { name: 'home', path: '/home', component: Home },
    { name: 'group', path: '/group/:groupId', component: GroupDetailContainer, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }] } },
    { name: 'pickupFeedback', path: '/group/:groupId/feedback', component: PickupFeedback, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'feedback', route: { name: 'feedback' } }] } },
    { name: 'stores', path: '/group/:groupId/store', component: Stores, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUP.STORES', route: { name: 'stores' } }] } },
    { name: 'store', path: '/group/:groupId/store/:storeId', component: StoreDetail, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { type: 'activeStore' }] } },
    { name: 'login', path: '/login', component: Login, beforeEnter: redirectIfLoggedIn },
    { name: 'signup', path: '/signup', component: Signup },
    { name: 'settings', path: '/settings', component: Settings, beforeEnter: protectRoute, meta: { breadcrumbs: [{ translation: 'SETTINGS.TITLE', route: { name: 'settings' } }] } },
    { name: 'user', path: '/user/:userId', component: User, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeUser' }] } },

    // Always leave this last one
    { path: '*', component: Error404 }, // Not found
  ],
})
router.afterEach((to, from) => {
  // save Breadcrumbs to store
  if (!(to.meta) || !(to.meta.breadcrumbs)) {
    store.dispatch('breadcrumbs/setAll', { breadcrumbs: [{name: 'not defined'}] })
  }
  store.dispatch('breadcrumbs/setAll', { breadcrumbs: to.meta.breadcrumbs })

  // save active group/store/user
  if (to.params.groupId) { store.dispatch('groups/selectGroup', { groupId: to.params.groupId }) }
})

sync(store, router)

export default router
