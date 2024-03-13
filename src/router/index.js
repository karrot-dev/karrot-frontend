import { createRouter, createWebHashHistory } from 'vue-router'

import embedRoutes from '@/base/routes/embed'
import mainRoutes from '@/base/routes/main'
import splashRoutes from '@/base/routes/splash'

const MainLayout = () => import('@/base/pages/MainLayout.vue')
const SplashLayout = () => import('@/base/pages/SplashLayout.vue')

const RouteError = () => import('@/base/components/RouteError.vue')

export default createRouter({
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
    // No layout!
    ...embedRoutes,
    // Always leave this last one
    { path: '/:catchAll(.*)*', component: RouteError }, // Not found
  ],
  scrollBehavior (to, from, savedPosition) {
    // keep scroll position if we stay on same page
    if (from.name === to.name) return

    if (to.hash) {
      return {
        el: to.hash,
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    else {
      return { left: 0, top: 0 }
    }
  },

  history: createWebHashHistory(process.env.VUE_ROUTER_BASE),
})
