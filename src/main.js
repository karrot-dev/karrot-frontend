import Vue from 'vue'
import configureQuasar from 'configureQuasar'
import 'helloDeveloper'

Vue.config.productionTip = false
Vue.config.devtools = true
configureQuasar(Vue)

const initApp = require('./app').default
initApp()
