// sorted alphabetically
const locales = {
  cs: {
    name: 'Čeština',
    locale: 'cs',
    messages: () => import('@/locales/locale-cs.json'),
    intlLocale: () => import('intl/locale-data/jsonp/cs'),
    dateFnsLocale: () => import('date-fns/locale/cs'),
    quasar: () => import('quasar-framework/i18n/cs'),
  },

  de: {
    name: 'Deutsch',
    locale: 'de',
    messages: () => import('@/locales/locale-de.json'),
    intlLocale: () => import('intl/locale-data/jsonp/de'),
    dateFnsLocale: () => import('date-fns/locale/de'),
    quasar: () => import('quasar-framework/i18n/de'),
  },

  en: {
    name: 'English',
    locale: 'en',
    messages: () => import('@/locales/locale-en.json'),
    intlLocale: () => import('intl/locale-data/jsonp/en'),
    dateFnsLocale: () => import('date-fns/locale/en'),
    quasar: () => import('quasar-framework/i18n/en-us'),
  },

  eo: {
    name: 'Esperanto',
    locale: 'eo',
    messages: () => import('@/locales/locale-eo.json'),
    intlLocale: () => import('intl/locale-data/jsonp/eo'),
    dateFnsLocale: () => import('date-fns/locale/eo'),
    quasar: () => import('quasar-framework/i18n/en-us'), // TODO switch when translated
  },

  es: {
    name: 'Español',
    locale: 'es',
    messages: () => import('@/locales/locale-es.json'),
    intlLocale: () => import('intl/locale-data/jsonp/es'),
    dateFnsLocale: () => import('date-fns/locale/es'),
    quasar: () => import('quasar-framework/i18n/es'),
  },

  fr: {
    name: 'Français',
    locale: 'fr',
    messages: () => import('@/locales/locale-fr.json'),
    intlLocale: () => import('intl/locale-data/jsonp/fr'),
    dateFnsLocale: () => import('date-fns/locale/fr'),
    quasar: () => import('quasar-framework/i18n/fr'),
  },

  gu: {
    name: 'ગુજરાતી',
    locale: 'gu',
    messages: () => import('@/locales/locale-gu.json'),
    intlLocale: () => import('intl/locale-data/jsonp/gu'),
    dateFnsLocale: () => import('date-fns/locale/en'), // TODO switch when translated
    quasar: () => import('quasar-framework/i18n/en-us'), // TODO switch when translated
  },

  hi: {
    name: 'हिन्दी',
    locale: 'hi',
    messages: () => import('@/locales/locale-hi.json'),
    intlLocale: () => import('intl/locale-data/jsonp/hi'),
    dateFnsLocale: () => import('date-fns/locale/en'), // TODO switch when translated
    quasar: () => import('quasar-framework/i18n/en-us'), // TODO switch when translated
  },

  it: {
    name: 'Italiano',
    locale: 'it',
    messages: () => import('@/locales/locale-it.json'),
    intlLocale: () => import('intl/locale-data/jsonp/it'),
    dateFnsLocale: () => import('date-fns/locale/it'),
    quasar: () => import('quasar-framework/i18n/it'),
  },

  mr: {
    name: 'मराठी',
    locale: 'mr',
    messages: () => import('@/locales/locale-mr.json'),
    intlLocale: () => import('intl/locale-data/jsonp/mr'),
    dateFnsLocale: () => import('date-fns/locale/en'), // TODO switch when translated
    quasar: () => import('quasar-framework/i18n/en-us'), // TODO switch when translated
  },

  pl: {
    name: 'Polski',
    locale: 'pl',
    messages: () => import('@/locales/locale-pl.json'),
    intlLocale: () => import('intl/locale-data/jsonp/pl'),
    dateFnsLocale: () => import('date-fns/locale/pl'),
    quasar: () => import('quasar-framework/i18n/pl'),
  },

  pt: {
    name: 'Português',
    locale: 'pt',
    messages: () => import('@/locales/locale-pt.json'),
    intlLocale: () => import('intl/locale-data/jsonp/pt'),
    dateFnsLocale: () => import('date-fns/locale/pt'),
    quasar: () => import('quasar-framework/i18n/pt'),
  },

  'pt-br': {
    name: 'Português Brasileiro',
    locale: 'pt-br',
    messages: () => import('@/locales/locale-pt_BR.json'),
    intlLocale: () => import('intl/locale-data/jsonp/pt-BR'),
    dateFnsLocale: () => import('date-fns/locale/pt'), // TODO switch to pt-br when datefns supports it
    quasar: () => import('quasar-framework/i18n/pt-br'),
  },

  ru: {
    name: 'Русский',
    locale: 'ru',
    messages: () => import('@/locales/locale-ru.json'),
    intlLocale: () => import('intl/locale-data/jsonp/ru'),
    dateFnsLocale: () => import('date-fns/locale/ru'),
    quasar: () => import('quasar-framework/i18n/ru'),
  },

  sv: {
    name: 'Svenska',
    locale: 'sv',
    messages: () => import('@/locales/locale-sv.json'),
    intlLocale: () => import('intl/locale-data/jsonp/sv'),
    dateFnsLocale: () => import('date-fns/locale/sv'),
    quasar: () => import('quasar-framework/i18n/sv'),
  },

  /*
  // Currently not used, please open issue if this should be enabled
  'zh-hans': {
    name: '中文 (Simplified)',
    locale: 'zh-hans',
    messages: () => import('@/locales/locale-zh_Hans.json'),
    intlLocale: () => import('intl/locale-data/jsonp/zh-Hans'),
    dateFnsLocale: () => import('date-fns/locale/zh_cn'),
    quasar: () => import('quasar-framework/i18n/zh-hans'),
  },
  */

  'zh-hant': {
    name: '中文',
    locale: 'zh-hant',
    messages: () => import('@/locales/locale-zh_Hant.json'),
    intlLocale: () => import('intl/locale-data/jsonp/zh-Hant'),
    dateFnsLocale: () => import('date-fns/locale/zh_tw'),
    quasar: () => import('quasar-framework/i18n/zh-hant'),
  },
}

export default locales

/**
 * Loading helpers
 */

export function messages (locale) {
  return locales[locale].messages()
}

export function intlLocale (locale) {
  return locales[locale].intlLocale()
}

export function dateFnsLocale (locale) {
  return locales[locale].dateFnsLocale()
}

export function quasarMessages (locale) {
  return locales[locale].quasar()
}
