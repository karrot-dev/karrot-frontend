import { reactive, watch } from 'vue'
import formatDistance from 'date-fns/formatDistance'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import en from 'date-fns/locale/en-US'
import { dateFnsLocale } from '@/locales/index'
import reactiveNow from '@/utils/reactiveNow'

const state = reactive({
  locale: 'en',
  localeData: en,
})

watch(() => state.locale, async locale => {
  const localeData = (await dateFnsLocale(locale)).default
  if (state.locale !== locale) return
  state.localeData = localeData
})

export default {
  setLocale (newLocale) {
    state.locale = newLocale
  },
  formatDistanceStrict (dateA, dateB) {
    return formatDistanceStrict(dateA, dateB, {
      locale: state.localeData,
      roundingMethod: 'floor',
    })
  },
  formatDistanceToNow (date, options = {}) {
    const now = reactiveNow.value
    if (options.future) {
      if (date < now) date = now
    }
    else {
      if (date > now) date = now
    }
    const fn = options.strict ? formatDistanceStrict : formatDistance
    return fn(date, now, { locale: state.localeData, ...options })
  },
}
