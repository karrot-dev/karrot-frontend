import Vue from 'vue'

import '@/base/style/app.mat.styl'
import 'quasar-framework/dist/quasar.ie.polyfills'
import 'quasar-extras/roboto-font/roboto-font.css'
import 'quasar-extras/material-icons/material-icons.css'
import 'quasar-extras/fontawesome/fontawesome.css'
import 'quasar-extras/animate'

import 'typeface-cabin-sketch'

import { sync } from 'vuex-router-sync'
import router from './router'
import datastore from './datastore'
import './socket'
import i18n from './i18n'
import log from '@/utils/log'
import './sentry'
import polyfill from '@/utils/polyfill'
import { DetectMobileKeyboardPlugin } from '@/utils/detectMobileKeyboard'
import { IconPlugin } from './icons'
import loadInitialData from './loadInitialData'

import Root from '@/base/pages/Root'
import '@/utils/datastore/presenceReporter'

export default async function initApp () {
  Vue.use(DetectMobileKeyboardPlugin)
  Vue.use(IconPlugin)

  if (__ENV.DEV) {
    log.setLevel('debug')
  }

  sync(datastore, router)

  if (__ENV.CORDOVA) {
    require('@/utils/cordova/setBaseURL')
  }

  await Promise.all([
    loadInitialData(),
    polyfill.init(),
  ])

  if (__ENV.CORDOVA) {
    require('@/utils/cordova')
  }

  /* eslint-disable no-new */
  const vueRoot = new Vue({
    el: '#q-app',
    router,
    store: datastore,
    i18n,
    render: h => h(Root),
  })

  // makes it easier to remote debug vue in cordova
  // for example to access vuex, type this into the console
  // window.vueRoot.$store.state
  window.vueRoot = vueRoot
}
