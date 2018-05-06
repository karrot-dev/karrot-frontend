import Quasar, { AppVisibility, CloseOverlay, Dialog, Notify } from 'quasar'

export const config = {
  plugins: {
    Dialog,
    Notify,
    AppVisibility,
  },
  directives: {
    CloseOverlay,
  },
}

export default (Vue) => {
  Vue.use(Quasar, config)
}
