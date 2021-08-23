// Vue config
import 'quasar/dist/quasar.sass'
import '@/css/app.sass'

import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import configureQuasar from '>/configureQuasar'
import { RouterLinkStub, TransitionStub, TransitionGroupStub } from '@vue/test-utils'
import icons from '@/base/icons'
import { app } from '@storybook/vue3'

app.config.devtools = true
configureQuasar(app)
app.use(Vuex) // Install Vuex
app.use(VueI18n)
app.use(VueRouter)
app.config.globalProperties.$icons = icons.get

app.component('RouterLink', RouterLinkStub)
app.component('Transition', TransitionStub)
app.component('TransitionGroup', TransitionGroupStub)
app.directive('measure', {})
app.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
}

import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

// Storybook config
import { create } from '@storybook/theming'

export const parameters = {
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Karrot Storybook',
      brandUrl: 'https://github.com/yunity/karrot-frontend',
    }),
    storySort: (a, b) => a[1].kind.localeCompare(b[1].kind),
  }
}
