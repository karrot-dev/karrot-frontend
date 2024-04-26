import { differenceInCalendarDays } from 'date-fns'
import formatDistance from 'date-fns/formatDistance'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import en from 'date-fns/locale/en-US'
import { computed, reactive } from 'vue'

import { dateFnsLocale } from '@/locales'
import reactiveNow from '@/utils/reactiveNow'

const state = reactive({
  locale: 'en',
  localeData: en,
})

const rtf = computed(() => {
  return new Intl.RelativeTimeFormat(state.locale, { numeric: 'auto' })
})

export default {
  async setLocale (locale) {
    state.locale = locale
    const localeData = (await dateFnsLocale(locale)).default
    if (state.locale !== locale) return
    state.localeData = localeData
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
    else if (options.future === false) {
      if (date > now) date = now
    }
    const fn = options.strict ? formatDistanceStrict : formatDistance
    if (options.days) {
      // We care about the days here, this is basically meaning the
      // lowest resolution we care about is a day
      // Causes it to format as yesterday/today/tomorrow/in 3 days, etc...
      const days = differenceInCalendarDays(date, now)
      if (Math.abs(days) < 10) {
        return rtf.value.format(days, 'day')
      }
    }
    return fn(date, now, { locale: state.localeData, ...options })
  },
}
