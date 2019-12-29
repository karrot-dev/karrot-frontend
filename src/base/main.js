/*
 * Entrypoint
 *
 * Do not import anything here that uses Quasar, as it is not configured yet. Use 'app.js' instead.
 */

import Vue from 'vue'
import configureQuasar from 'base/configureQuasar'
import 'base/helloDeveloper'

Vue.config.productionTip = false
Vue.config.devtools = true
configureQuasar(Vue)

const initApp = require('./app').default
initApp()
