import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'

import store from '@/store'

import MainLayout from '@/components/Layout/MainLayout'
import GroupLayout from '@/components/Layout/GroupLayout'
import GroupWall from '@/pages/Group/Wall.vue'
import GroupMap from '@/pages/Map.vue'
import StoreWall from '@/pages/StoreDetail.vue'
import StoreList from '@/pages/Stores.vue'
import GroupHistory from '@/pages/Group/History.vue'
import GroupDescription from '@/pages/Group/Description.vue'
import GroupMapAndStoresSidenav from '@/components/Sidenav/SidenavMapAndStores.vue'
import GroupGroupSidenav from '@/components/Sidenav/SidenavGroup.vue'
import GroupStoreSidenav from '@/components/Sidenav/SidenavStore.vue'
import Error404 from '@/components/Error404.vue'
import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'
import Settings from '@/pages/Settings.vue'
import User from '@/pages/User.vue'
import PickupFeedback from '@/pages/Group/Feedback.vue'

/*
import Home from '@/components/Home.vue'
import GroupDescription from '@/pages/Group/Description.vue'
import GroupHistory from '@/pages/Group/History.vue'
import Error404 from '@/components/Error404.vue'
import Map from '@/pages/Map.vue'
import Stores from '@/pages/Stores.vue'
import Settings from '@/pages/Settings.vue'
import StoreDetail from '@/pages/StoreDetail.vue'
import PickupFeedback from '@/pages/Feedback.vue'
*/

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
    {
      path: '',
      component: MainLayout,
      redirect: '/group/:groupId/wall',
      children: [
        {
          path: '/group/:groupId',
          redirect: '/group/:groupId/wall',
          components: {
            default: GroupLayout,
            sidenav: GroupMapAndStoresSidenav,
          },
          beforeEnter: protectRoute,
          children: [
            {
              name: 'group',
              path: 'wall',
              meta: { breadcrumbs: [{ type: 'activeGroup' }] },
              components: {
                default: GroupWall,
                sidenav: GroupGroupSidenav,
              },
            },
            {
              name: 'groupDescription',
              path: 'description',
              meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUP.DESCRIPTION', route: { name: 'groupDescription' } }] },
              components: {
                default: GroupDescription,
                sidenav: GroupGroupSidenav,
              },
            },
            {
              name: 'groupHistory',
              path: 'history',
              meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUP.HISTORY', route: { name: 'groupHistory' } }] },
              components: {
                default: GroupHistory,
                sidenav: GroupGroupSidenav,
              },
            },
            {
              name: 'stores',
              path: 'store',
              meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUP.STORES', route: { name: 'stores' } }] },
              components: {
                default: StoreList,
                sidenav: GroupStoreSidenav,
              },
            },
            {
              name: 'store',
              path: 'store/:storeId',
              meta: { breadcrumbs: [{ type: 'activeGroup' }, { type: 'activeStore' }] },
              components: {
                default: StoreWall,
                sidenav: GroupStoreSidenav,
              },
            },
            {
              name: 'pickupFeedback',
              path: 'feedback',
              meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'FEEDBACK.TITLE', route: { name: 'pickupFeedback' } }] },
              components: {
                default: PickupFeedback,
              },
            },
          ],
        },
        {
          name: 'map',
          path: '/group/:groupId/map',
          beforeEnter: protectRoute,
          meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUPMAP.TITLE', route: { name: 'map' } }] },
          components: {
            default: GroupMap,
          },
        },
        {
          name: 'login',
          path: '/login',
          beforeEnter: redirectIfLoggedIn,
          meta: { breadcrumbs: [{ translation: 'LOGIN.TITLE', route: { name: 'login' } }] },
          components: {
            default: Login,
          },
        },
        {
          name: 'signup',
          path: '/signup',
          beforeEnter: redirectIfLoggedIn,
          meta: { breadcrumbs: [{ translation: 'SIGNUP.TITLE', route: { name: 'signup' } }] },
          components: {
            default: Signup,
          },
        },
        {
          name: 'settings',
          path: '/settings',
          beforeEnter: protectRoute,
          meta: { breadcrumbs: [{ translation: 'SETTINGS.TITLE', route: { name: 'settings' } }] },
          components: {
            default: Settings,
          },
        },
        {
          name: 'user',
          path: '/user/:userId',
          beforeEnter: protectRoute,
          meta: { breadcrumbs: [{ type: 'activeUser' }] },
          components: {
            default: User,
          },
        },
      ],
    },
    /*
    { name: 'group', path: '/group/:groupId', component: Group, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }] } },
    { name: 'stores', path: '/group/:groupId/store', component: Stores, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUP.STORES', route: { name: 'stores' } }] } },
    { name: 'map', path: '/group/:groupId/map', component: Map, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUPMAP.TITLE', route: { name: 'map' } }] } },
    { name: 'store', path: '/group/:groupId/store/:storeId', component: StoreDetail, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { type: 'activeStore' }] } },
    { name: 'groupDescription', path: '/group/:groupId/description', component: GroupDescription, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUP.DESCRIPTION', route: { name: 'groupDescription' } }] } },
    { name: 'groupHistory', path: '/group/:groupId/history', component: GroupHistory, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUP.HISTORY', route: { name: 'groupHistory' } }] } },
    { name: 'login', path: '/login', component: Login, beforeEnter: redirectIfLoggedIn },
    { name: 'signup', path: '/signup', component: Signup },    
    { name: 'settings', path: '/settings', component: Settings, beforeEnter: protectRoute, meta: { breadcrumbs: [{ translation: 'SETTINGS.TITLE', route: { name: 'settings' } }] } },
    { name: 'user', path: '/user/:userId', component: User, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeUser' }] } },
    { name: 'pickupFeedback', path: '/group/:groupId/feedback', component: PickupFeedback, beforeEnter: protectRoute, meta: { breadcrumbs: [{ type: 'activeGroup' }, { translation: 'feedback', route: { name: 'feedback' } }] } },

    */

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
  if (to.params.storeId) { store.dispatch('stores/selectStore', { storeId: to.params.storeId }) }
  if (to.params.userId) { store.dispatch('users/selectUser', { userId: to.params.userId }) }
})

sync(store, router)

export default router
