// Vue config (from main.js)
import '../src/base/style/app.mat.styl'

import Vue from 'vue'
import Vuex from 'vuex'
import configureQuasar from '@/base/configureQuasar'
import { RouterLinkStub } from '@vue/test-utils'

Vue.config.productionTip = false
Vue.config.devtools = true
configureQuasar(Vue)
Vue.use(Vuex) // Install Vuex

Vue.component('router-link', RouterLinkStub)
Vue.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
}

import 'quasar-extras/roboto-font/roboto-font.css'
import 'quasar-extras/material-icons/material-icons.css'
import 'quasar-extras/fontawesome/fontawesome.css'
import 'quasar-extras/animate'

// Storybook config
import { configure } from '@storybook/vue'

const req = require.context('../src', true, /\.story\.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
