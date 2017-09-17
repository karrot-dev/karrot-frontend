import i18n from '@/i18n'
import { getter } from '@/store/helpers'

export default store => {
  store.watch(getter('i18n/getLocale'), locale => {
    i18n.locale = locale
  }, {immediate: true})
}
