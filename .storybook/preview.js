import {setup} from "@storybook/vue3";
import {AppVisibility, Dialog, Notify, Quasar, TouchHold } from "quasar";
import {i18nPlugin} from "@/base/i18n";
import {VueQueryPlugin} from "@tanstack/vue-query";
import queryClient from '@/base/queryClient'
import {createRouter, createWebHashHistory} from 'vue-router'
// TODO: vite doesn't want to load from here, maybe test dir is not included somewhere?
// just copying the config in
// import quasarConfig from '>/quasar.conf'

import '@/css/app.sass'
import '@/css/quasar.variables.sass'
import 'quasar/dist/quasar.sass'

// import '@/css/storybook.sass'

// Would be nice to get quasar to load these
// as it's from quasar config extras
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/material-icons/material-icons.css'

import icons from "@/base/icons"

let ClosePopup;
const quasarConfig = {
  plugins: {
    Dialog,
    AppVisibility,
    Notify,
  },
  directives: {
    ClosePopup,
    TouchHold,
  },
}



/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

const router = createRouter({
  routes: [],
  history: createWebHashHistory(),
})

setup(app => {
  // gets called multiple times with the same app
  // which causes errors, see:
  // https://github.com/storybookjs/storybook/issues/18222
  if (app.__INITIALIZED) {
    console.log('[Karrot] Storybook vue app already initialized, ignoring setup')
    return
  }
  // console.log('storybook setup!', app.__SETUP)
  app.__INITIALIZED = true
  app.config.globalProperties.$icon = icons.get
  app.use(i18nPlugin)
  app.use(VueQueryPlugin, { queryClient })
  app.use(router)
  app.use(Quasar, quasarConfig)
})

export default preview;
