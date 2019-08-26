import Quasar from 'quasar-vue-plugin'

import { AppVisibility, ClosePopup, Dialog, Notify, TouchHold } from 'quasar'

export const config = {
  plugins: {
    Dialog,
    Notify,
    AppVisibility,
  },
  directives: {
    ClosePopup,
    TouchHold,
  },
}

export default (Vue) => {
  Vue.use(Quasar, config)
}
