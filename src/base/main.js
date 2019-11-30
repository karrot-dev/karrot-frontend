import { measure } from '@/utils/performance'

measure('main.js', 'top')

import Vue from 'vue'
import configureQuasar from 'base/configureQuasar'
import 'base/helloDeveloper'

Vue.config.productionTip = false
Vue.config.devtools = true
configureQuasar(Vue)

const initApp = require('./app').default
initApp()

measure('main.js', 'bottom')
