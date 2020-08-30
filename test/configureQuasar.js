import { Quasar, AppVisibility, ClosePopup, Dialog, TouchHold } from 'quasar'

export const config = {
  plugins: {
    Dialog,
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
