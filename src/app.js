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

if (CORDOVA && BACKEND) {
  require('@/cordova')
}

if (process.env.NODE_ENV !== 'production') {
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

  store.dispatch('about/fetch')
  // store.dispatch('groupApplications/fetchMine') // TODO: store elsewhere in the future probably maybe Idk
  store.dispatch('communityFeed/fetchTopics')

  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    i18n,
    render: h => h(Root),
  })
}
