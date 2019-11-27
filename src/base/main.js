import Vue from 'vue'
import configureQuasar from 'base/configureQuasar'
import 'base/helloDeveloper'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true
configureQuasar(Vue)

const initApp = require('./app').default
initApp()
