import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { isObject, camelize } from '@/services/utils'

// Hotfix to use existing files
// e.g. converts translations containing {{store_name}} into {storeName}
// TODO: convert files and sync them with transifex
export function angularToVueI18n (val) {
  if (isObject(val)) {
    let newVal = {}
    for (const key of Object.keys(val)) {
      newVal[key] = angularToVueI18n(val[key])
    }
    return newVal
  }
  else {
    return val.replace(/{{(.*?)}}/g, (_, a) => `{${camelize(a)}}`)
  }
}

Vue.use(VueI18n)

// Just need to include 'en' here as it is the fallback locale
// All other locales are loaded on demand in store/plugins/i18n
export const messages = {
  en: angularToVueI18n(require('@/locales/locale-en.json')),
}

export const locales = [
  { locale: 'de', name: 'Deutsch' },
  { locale: 'en', name: 'English' },
  { locale: 'fr', name: 'Français' },
  { locale: 'sv', name: 'Svenska' },
  { locale: 'es', name: 'Español' },
  { locale: 'it', name: 'Italiano' },
  { locale: 'eo', name: 'Esperanto' },
  { locale: 'ru', name: 'Русский' },
  { locale: 'zh', name: '中文' },
]

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
}

let dateTimeFormats = {}
for (const locale of locales) {
  dateTimeFormats[locale.locale] = defaultDateTimeFormat
}

const i18n = new VueI18n({
  messages,
  dateTimeFormats,
  fallbackLocale: 'en', // if you change this make sure to always load the locale too
})

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

export default i18n

if (module.hot) {
  module.hot.accept([
    '@/locales/locale-en.json',
  ], () => {
    i18n.setLocaleMessage('en', angularToVueI18n(require('@/locales/locale-en.json')))
  })
}
