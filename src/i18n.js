import Vue from 'vue'
import VueI18n from 'vue-i18n'
import status from '@/locales/status-frontend.json'
import locales from '@/locales'

Vue.use(VueI18n)

const defaultDateTimeFormat = {
  timeShort: {
    hour: 'numeric',
    minute: 'numeric',
  },
  dateShort: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
  dayName: {
    weekday: 'long',
  },
  dayAndTime: {
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
  },
  dateWithDayName: {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  },
  dateLongWithDayName: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  },
}

let dateTimeFormats = {}
for (const locale of Object.values(locales)) {
  dateTimeFormats[locale.locale] = defaultDateTimeFormat
}

const i18n = new VueI18n({
  // Just need to include 'en' here as it is the fallback locale
  // All other locales are loaded on demand in store/plugins/i18n
  messages: {
    en: require('@/locales/locale-en.json'),
  },
  dateTimeFormats,
  fallbackLocale: 'en', // if you change this make sure to always load the locale too
})
export default i18n

const TEN_PM = new Date()
TEN_PM.setHours(22, 0)

export function is24h () {
  return i18n.d(TEN_PM, 'timeShort') === '22:00'
}

const DAY_KEYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
const DAY_INDEX = DAY_KEYS.reduce((acc, key, idx) => {
  acc[key] = idx
  return acc
}, {})
const SUNDAY_INDEX = DAY_KEYS.indexOf('SU')

export function dayNameForKey (key) {
  const date = new Date()
  date.setDate(date.getDate() - date.getDay() - SUNDAY_INDEX + DAY_INDEX[key])
  return i18n.d(date, 'dayName')
}
export function dayNames () {
  return DAY_KEYS.map(dayNameForKey)
}

export function dayOptions () {
  return DAY_KEYS.map(key => ({
    label: dayNameForKey(key),
    value: key,
  }))
}

export function sortByDay (a, b) {
  return DAY_INDEX[a] - DAY_INDEX[b]
}

export const localeOptions = Object.values(locales).map(({ name, locale }) => ({
  label: name,
  value: locale,
  percentage: parseInt(status[locale].completed.replace('%', ''), 10),
})).sort((a, b) => b.percentage - a.percentage)

// Does not work, pls fix
/*
if (module.hot) {
  module.hot.accept([
    '@/locales/locale-en.json',
  ], () => {
    i18n.setLocaleMessage('en', require('@/locales/locale-en.json'))
  })
}
*/
