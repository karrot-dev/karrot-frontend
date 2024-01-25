import { setup } from '@storybook/vue3'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { Quasar } from 'quasar'
import { createRouterMock, injectRouterMock } from 'vue-router-mock'

import { i18nPlugin } from '@/base/i18n'
import icons from '@/base/icons'
import queryClient from '@/base/queryClient'

import { setupMockBackend } from '>/mockBackend'
import quasarConfig from '>/quasarConfig'

import karrotTheme from './karrot-theme'

import 'quasar/dist/quasar.sass'
import '@/css/app.sass'

// Would be nice to get quasar to load these
// as it's from quasar config extras
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/material-icons/material-icons.css'

setupMockBackend()

setup(app => {
  app.config.globalProperties.$icon = icons.get
  app.use(i18nPlugin)
  app.use(VueQueryPlugin, { queryClient })

  const mockRouter = createRouterMock({
    routes: [
      // Just avoids a few warnings, and is a common route...
      {
        name: 'user',
        path: '/user/:userId',
      },
    ],
    spy: {
      create: fn => fn,
      reset: () => {},
    },
  })
  app.use(mockRouter)
  injectRouterMock(mockRouter)

  app.use(Quasar, quasarConfig)

  app.component('Measure', {})
  app.directive('ragged-edges', {})

  app.config.errorHandler = (err, vm, info) => {
    console.log(err, vm, info)
  }
})

/** @type { import('@storybook/vue3').Preview } */
export default {
  parameters: {
    options: {
      theme: karrotTheme,
    },
    docs: {
      theme: karrotTheme,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}
