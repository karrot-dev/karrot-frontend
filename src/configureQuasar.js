import Quasar from 'quasar-vue-plugin'

import { AppVisibility, CloseOverlay, Dialog, Notify } from 'quasar'

import iconSet from 'quasar-framework/icons/material-icons'

export const config = {
  plugins: {
    Dialog,
    Notify,
    AppVisibility,
  },
  directives: {
    CloseOverlay,
  },
  iconSet,
}

export default (Vue) => {
  Vue.use(Quasar, config)
}
