import Vue from 'vue'

import '@/base/css/app.mat.styl'
import 'quasar-framework/dist/quasar.ie.polyfills'
import 'quasar-extras/roboto-font/roboto-font.css'
import 'quasar-extras/material-icons/material-icons.css'
import 'quasar-extras/fontawesome/fontawesome.css'
import 'quasar-extras/animate'

import 'typeface-cabin-sketch'

import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import './socket'
import i18n from './i18n'
import log from '@/utils/log'
import './raven'
import polyfill from '@/utils/polyfill'
import { DetectMobileKeyboardPlugin } from '@/utils/detectMobileKeyboard'

Vue.use(DetectMobileKeyboardPlugin)

if (__ENV.CORDOVA && __ENV.BACKEND) {
  require('@/cordova')
}

if (__ENV.DEV) {
  log.setLevel('debug')
}

import Root from '@/base/pages/Root'
import '@/utils/datastore/presenceReporter'

export default async function initApp () {
  sync(store, router)

  await Promise.all([
    polyfill.init(),
    store.dispatch('auth/refresh'),
  ])

  store.dispatch('groups/fetch')

  if (!__ENV.DEV) {
    store.dispatch('about/fetch')
  }
  store.dispatch('communityFeed/fetchTopics')

  /* eslint-disable no-new */
  const vueRoot = new Vue({
    el: '#q-app',
    router,
    store,
    i18n,
    render: h => h(Root),
  })

  // makes it easier to remote debug vue in cordova
  // for example to access vuex, type this into the console
  // window.vueRoot.$store.state
  window.vueRoot = vueRoot
}
