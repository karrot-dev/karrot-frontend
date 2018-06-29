require(`./themes/app.${__THEME}.styl`)

import 'quasar-framework/dist/quasar.ie.polyfills'

import Vue from 'vue'
import configureQuasar from 'configureQuasar'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import './socket'
import i18n from './i18n'
import log from '@/services/log'
import './raven'
import polyfill from '@/polyfill'

if (CORDOVA && BACKEND) {
  require('@/cordova')
}

Vue.config.productionTip = false
Vue.config.performance = true
configureQuasar(Vue)

if (process.env.NODE_ENV !== 'production') {
  log.setLevel('debug')
}

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/animate'
import 'typeface-cabin-sketch'
import App from '@/App'
import '@/presenceReporter'

const { DetectMobileKeyboardPlugin } = require('@/services/detectMobileKeyboard')
Vue.use(DetectMobileKeyboardPlugin)

;(async () => {
  sync(store, router)

  await Promise.all([
    polyfill.init(),
    store.dispatch('auth/check'),
    store.dispatch('groups/fetch'),
  ])

  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    i18n,
    render: h => h(App),
  })
})()
