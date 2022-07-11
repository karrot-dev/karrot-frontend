<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'
import VueRouter from 'vue-router'
=======
import { createRouter, createWebHashHistory } from 'vue-router'

>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import splashRoutes from '@/base/routes/splash'
import mainRoutes from '@/base/routes/main'

const MainLayout = () => import('@/base/pages/MainLayout')
const SplashLayout = () => import('@/base/pages/SplashLayout')

const RouteError = () => import('@/base/components/RouteError')

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
