import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'

const MainLayout = () => import('@/components/Layout/MainLayout')
const GroupLayout = () => import('@/components/Layout/GroupLayout')
const GroupWall = () => import('@/pages/Group/Wall.vue')
const GroupMap = () => import('@/pages/Map.vue')
const StoreLayout = () => import('@/pages/Store/Layout.vue')
const StoreWall = () => import('@/pages/Store/Wall.vue')
const StorePickups = () => import('@/pages/Store/Pickups.vue')
const StoreHistory = () => import('@/pages/Store/History.vue')
const StoreList = () => import('@/pages/Store/Stores.vue')
const GroupHistory = () => import('@/pages/Group/History.vue')
const GroupDescription = () => import('@/pages/Group/Description.vue')
const GroupMapAndStoresSidenav = () => import('@/components/Sidenav/SidenavMapAndStores.vue')
const GroupGroupSidenav = () => import('@/components/Sidenav/SidenavGroup.vue')
const GroupStoreSidenav = () => import('@/components/Sidenav/SidenavStore.vue')
const Error404 = () => import('@/components/Error404.vue')
const Login = () => import('@/pages/Login.vue')
const Signup = () => import('@/pages/Signup.vue')
const Settings = () => import('@/pages/Settings.vue')
const User = () => import('@/pages/User.vue')
const PickupFeedback = () => import('@/pages/Group/Feedback.vue')

Vue.use(VueRouter)
Vue.use(Meta)

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
          meta: { requireLoggedIn: true },
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
              redirect: '/group/:groupId/store/:storeId/wall',
              path: 'store/:storeId',
              meta: { breadcrumbs: [{ type: 'activeGroup' }, { type: 'activeStore' }] },
              components: {
                default: StoreLayout,
                sidenav: GroupStoreSidenav,
              },
              children: [
                {
                  name: 'store',
                  path: '',
                  redirect: 'pickups',
                  meta: { breadcrumbs: [{ type: 'activeGroup' }, { type: 'activeStore' }] },
                  components: { default: StoreWall },
                },
                {
                  name: 'storePickups',
                  path: 'pickups',
                  meta: { breadcrumbs: [{ type: 'activeGroup' }, { type: 'activeStore' }] },
                  components: { default: StorePickups },
                },
                {
                  name: 'storeHistory',
                  path: 'history',
                  meta: { breadcrumbs: [{ type: 'activeGroup' }, { type: 'activeStore' }] },
                  components: { default: StoreHistory },
                },
              ],
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
          meta: { requireLoggedIn: true, breadcrumbs: [{ type: 'activeGroup' }, { translation: 'GROUPMAP.TITLE', route: { name: 'map' } }] },
          components: {
            default: GroupMap,
          },
        },
        {
          name: 'login',
          path: '/login',
          meta: { requireLoggedOut: true, breadcrumbs: [{ translation: 'LOGIN.TITLE', route: { name: 'login' } }] },
          components: {
            default: Login,
          },
        },
        {
          name: 'signup',
          path: '/signup',
          meta: { requireLoggedIn: true, breadcrumbs: [{ translation: 'SIGNUP.TITLE', route: { name: 'signup' } }] },
          components: {
            default: Signup,
          },
        },
        {
          name: 'settings',
          path: '/settings',
          meta: { requireLoggedIn: true, breadcrumbs: [{ translation: 'SETTINGS.TITLE', route: { name: 'settings' } }] },
          components: {
            default: Settings,
          },
        },
        {
          name: 'user',
          path: '/user/:userId',
          meta: { requireLoggedIn: true, breadcrumbs: [{ type: 'activeUser' }] },
          components: {
            default: User,
          },
        },
      ],
    },

    // Always leave this last one
    { path: '*', component: Error404 }, // Not found
  ],
})

export default router
