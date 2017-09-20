import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

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
}

let dateTimeFormats = {}
for (const locale of locales) {
  dateTimeFormats[locale.locale] = defaultDateTimeFormat
}

const i18n = new VueI18n({
  messages: {}, // loaded on demand in store/plugins/i18n
  dateTimeFormats,
  fallbackLocale: 'en',
})

export default i18n
