require(`./themes/app.${__THEME}.styl`)

// Uncomment the following lines if you need IE11/Edge support
require(`quasar-framework/dist/quasar.ie.polyfills`)

import Vue from 'vue'
import Quasar from 'quasar'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import './socket'
import i18n from './i18n'
import log from '@/services/log'
import './raven'
import { DetectMobileKeyboardPlugin } from '@/services/detectMobileKeyboard'
import polyfill from '@/polyfill'

if (CORDOVA && BACKEND) {
  require('@/cordova')
}

Vue.config.productionTip = false
Vue.use(Quasar)
Vue.use(DetectMobileKeyboardPlugin)

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

  const [App] = await Promise.all([
    import('./App'),
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
