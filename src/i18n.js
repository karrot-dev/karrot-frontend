import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const messages = {
  en: require('@/locales/locale-en.json'),
  de: require('@/locales/locale-de.json'),
  eo: require('@/locales/locale-eo.json'),
  es: require('@/locales/locale-es.json'),
  fr: require('@/locales/locale-fr.json'),
  it: require('@/locales/locale-it.json'),
  ru: require('@/locales/locale-ru.json'),
  sv: require('@/locales/locale-sv.json'),
  zh: require('@/locales/locale-zh.json')
}

export const DEFAULT_LOCALE = 'en'

export function detectLocale () {
  // Based on https://angular-translate.github.io/docs/#/guide/07_multi-language#multi-language_determining-preferred-language-automatically
  let val =
    navigator.languages[0] ||
    navigator.language ||
    navigator.browserLanguage ||
    navigator.systemLanguage ||
    navigator.userLanguage
  if (val) {
    return val.replace(/-.*$/, '')
  }
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
  { locale: 'zh', name: '中文' }
]

const dateTimeFormats = {
  'de-DE': {
    short: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}

const i18n = new VueI18n({
  locale: detectLocale() || DEFAULT_LOCALE,
  messages
})

export default i18n

if (module.hot) {
  /*

    Looks a bit verbose right?

    Hot module reloading seems to *really* want these to all be explicit strings.
    I did try making them variables, etc... and the hot reload would work for one change
    then start doing full page reloads again after that :/

    Would be happy if you can investigate further and get it to work, but I am happy
    with this approach right now :)

  */

  module.hot.accept([
    '@/locales/locale-en.json',
    '@/locales/locale-de.json',
    '@/locales/locale-eo.json',
    '@/locales/locale-es.json',
    '@/locales/locale-fr.json',
    '@/locales/locale-it.json',
    '@/locales/locale-ru.json',
    '@/locales/locale-sv.json',
    '@/locales/locale-zh.json'
  ], () => {
    i18n.setLocaleMessage('en', require('@/locales/locale-en.json'))
    i18n.setLocaleMessage('de', require('@/locales/locale-de.json'))
    i18n.setLocaleMessage('eo', require('@/locales/locale-eo.json'))
    i18n.setLocaleMessage('es', require('@/locales/locale-es.json'))
    i18n.setLocaleMessage('fr', require('@/locales/locale-fr.json'))
    i18n.setLocaleMessage('it', require('@/locales/locale-it.json'))
    i18n.setLocaleMessage('ru', require('@/locales/locale-ru.json'))
    i18n.setLocaleMessage('sv', require('@/locales/locale-sv.json'))
    i18n.setLocaleMessage('zh', require('@/locales/locale-zh.json'))
  })
}
