// Vue config
import 'quasar/dist/quasar.css'
import '@/css/app.sass'

// import Vuex from 'vuex'
// import VueRouter from 'vue-router'
import { i18nPlugin } from '@/base/i18n'
import { Quasar } from 'quasar'
import quasarConfig from '>/quasarConfig'
import { RouterLinkStub } from '@vue/test-utils'
import icons from '@/base/icons'
import { app } from '@storybook/vue3'

app.use(i18nPlugin)
app.use(Quasar, quasarConfig)
// app.use(Vuex)
// app.use(VueRouter)
app.config.globalProperties.$icon = icons.get

app.component('RouterLink', RouterLinkStub)
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
      brandUrl: 'https://github.com/karrot-dev/karrot-frontend',
    }),
    storySort: (a, b) => a[1].kind.localeCompare(b[1].kind),
  }
}
