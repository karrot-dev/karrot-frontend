import Vue from 'vue'
import VueRouter from 'vue-router'
import splashRoutes from '@/base/routes/splash'
import mainRoutes from '@/base/routes/main'

const MainLayout = () => import('@/base/pages/MainLayout')
const SplashLayout = () => import('@/base/pages/SplashLayout')
const RouteError = () => import('@/base/components/RouteError')

Vue.use(VueRouter)

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
   *  - currentGroup
   *  - activePlace
   * ...you can define other ones in KBreadcrumb.
   */
  routes: [
    {
      path: '',
      component: MainLayout,
      children: [
        ...mainRoutes,
        {
          path: '',
          component: SplashLayout,
          children: splashRoutes,
        },
      ],
    },

    // Always leave this last one
    { path: '*', component: RouteError }, // Not found
  ],
  scrollBehavior (to, from, savedPosition) {
    // keep scroll position if we stay on same page
    if (from.name === to.name) return

    if (to.hash) {
      return {
        selector: to.hash,
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    else {
      return { x: 0, y: 0 }
    }
  },
})

export default router
