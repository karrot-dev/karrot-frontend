import { Quasar, AppVisibility, ClosePopup, Dialog, Notify, TouchHold } from 'quasar'

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
