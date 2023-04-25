// Vue config
import 'quasar/dist/quasar.css'
import '@/css/app.sass'

import VueRouter from 'vue-router'
import { VueQueryPlugin } from 'vue-query'
import { i18nPlugin } from '@/base/i18n'
import { Quasar } from 'quasar'
import quasarConfig from '>/quasarConfig'
import icons from '@/base/icons'
import { setup } from '@storybook/vue3'
import { h } from 'vue'
import queryClient from '@/base/queryClient'
import { setupMockBackend } from '>/mockBackend'


setup(app => {
  app.use(i18nPlugin)
  app.use(Quasar, quasarConfig)
  app.use(VueQueryPlugin, { queryClient })
  app.use(VueRouter)
  app.config.globalProperties.$icon = icons.get
  // TODO: should be able to remove this with vue v3.3.x
  app.config.unwrapInjectedRef = true

  // In theory the RouterLinkStub in @vue/test-utils would work, but I get
  // call is not a function errors when using that...
  const RouterLinkStub = {
    compatConfig: { MODE: 3 },
    render() {
      return h('a', undefined, this.$slots.default && this.$slots.default())
    }
  }
  app.component('RouterLink', RouterLinkStub)
  app.directive('measure', {})
  app.config.errorHandler = (err, vm, info) => {
    console.log(err, vm, info)
  }
})

import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

setupMockBackend()

// Storybook config
import { create } from '@storybook/theming'
import { faker } from '@faker-js/faker'

faker.seed(500)

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
