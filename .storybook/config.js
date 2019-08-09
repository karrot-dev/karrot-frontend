// Vue config (from main.js)
import '../src/base/style/app.styl'

import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import configureQuasar from '@/base/configureQuasar'
import { RouterLinkStub, TransitionStub, TransitionGroupStub } from '@vue/test-utils'
import { IconPlugin } from '@/base/icons'

Vue.config.productionTip = false
Vue.config.devtools = true
configureQuasar(Vue)
Vue.use(Vuex) // Install Vuex
Vue.use(IconPlugin)
Vue.use(VueI18n)
Vue.use(VueRouter)

Vue.component('RouterLink', RouterLinkStub)
Vue.component('Transition', TransitionStub)
Vue.component('TransitionGroup', TransitionGroupStub)
Vue.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
}

import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
// import '@quasar/extras/animate' TODO

// Storybook config
import { addParameters, configure } from '@storybook/vue'
import { create } from '@storybook/theming'

function loadStories() {
  const req = require.context('../src', true, /\Settings.story\.js$/)
  req.keys().forEach(filename => req(filename))
}

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Karrot Storybook',
      brandUrl: 'https://github.com/yunity/karrot-frontend',
    }),
    storySort: (a, b) => a[1].kind.localeCompare(b[1].kind),
  }
})

configure(loadStories, module)
