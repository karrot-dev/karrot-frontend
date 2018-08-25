import Vue from 'vue'

import '@/themes/app.mat.styl'
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
import log from '@/services/log'
import './raven'
import polyfill from '@/polyfill'
import { DetectMobileKeyboardPlugin } from '@/services/detectMobileKeyboard'

Vue.use(DetectMobileKeyboardPlugin)

if (__ENV.CORDOVA && __ENV.BACKEND) {
  require('@/cordova')
}

if (__ENV.DEV) {
  log.setLevel('debug')
}

import Root from '@/Root'
import '@/presenceReporter'

export default async function initApp () {
  sync(store, router)

  await Promise.all([
    polyfill.init(),
    store.dispatch('auth/check'),
    store.dispatch('groups/fetch'),
  ])

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

  if (__ENV.DEV) {
    // makes it easier to remote debug vue in cordova
    // for example to access vuex, type this into the console
    // window.vueRoot.$store.state
    window.vueRoot = vueRoot
  }
}
