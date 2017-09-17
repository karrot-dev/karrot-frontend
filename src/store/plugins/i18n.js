import i18n from '@/i18n'

export default store => {
  store.watch(state => state.i18n.locale, locale => {
    i18n.locale = locale
  }, {immediate: true})
}
