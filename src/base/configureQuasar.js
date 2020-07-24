import { Quasar, AppVisibility, ClosePopup, Dialog, Notify, TouchHold } from 'quasar'

export const config = {
  plugins: {
    Dialog,
    AppVisibility,
    /* Workaround: do not install Notify plugin in test environment
    quasar 1.12.5 introduced a problem that would result in "TypeError: Cannot read property 'fullscreen' of undefined" when installing the Notify plugin */
    ...(process.env.NODE_ENV !== 'test' ? { Notify } : {}),
  },
  directives: {
    ClosePopup,
    TouchHold,
  },
}

export default (Vue) => {
  Vue.use(Quasar, config)
}
