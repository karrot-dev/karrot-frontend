// Vue config (from main.js)

// default to material design
import '../src/themes/app.mat.styl'

import Vue from 'vue'
import Vuex from 'vuex'
import configureQuasar from '@/configureQuasar'
import { RouterLinkStub } from '@vue/test-utils'

Vue.config.productionTip = false
Vue.config.devtools = true
configureQuasar(Vue)
Vue.use(Vuex) // Install Vuex

Vue.component('router-link', RouterLinkStub)
Vue.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
}

import 'quasar-extras/roboto-font'
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/animate'

// Storybook config
import { configure } from '@storybook/vue'

const req = require.context('../src', true, /\.story\.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
