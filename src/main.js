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

(async () => {
  sync(store, router)

  const detectMobileKeyboard = await import('@/services/detectMobileKeyboard')
  Vue.use(detectMobileKeyboard.DetectMobileKeyboardPlugin)

  const [App] = await Promise.all([
    import('./App'),
    import('@/presenceReporter'),
    polyfill.init(),
    store.dispatch('auth/check'),
    store.dispatch('groups/fetch'),
  ])

  const app = App.default
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    i18n,
    render: h => h(app),
  })
})()
