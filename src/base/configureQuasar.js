import Quasar from 'quasar-vue-plugin'

import { AppVisibility, CloseOverlay, Dialog, Notify, TouchHold } from 'quasar'

export const config = {
  plugins: {
    Dialog,
    Notify,
    AppVisibility,
  },
  directives: {
    CloseOverlay,
    TouchHold,
  },
}

export default (Vue) => {
  Vue.use(Quasar, config)
}
