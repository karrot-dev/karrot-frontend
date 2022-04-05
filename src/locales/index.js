// sorted alphabetically
const locales = {
  cs: {
    name: 'Čeština',
    locale: 'cs',
    messages: () => import('@/locales/locale-cs.json'),
    intlLocale: () => import('intl/locale-data/jsonp/cs'),
    dateFnsLocale: () => import('date-fns/locale/cs'),
    quasar: () => import('quasar/lang/cs'),
  },

  de: {
    name: 'Deutsch',
    locale: 'de',
    messages: () => import('@/locales/locale-de.json'),
    intlLocale: () => import('intl/locale-data/jsonp/de'),
    dateFnsLocale: () => import('date-fns/locale/de'),
    quasar: () => import('quasar/lang/de'),
  },

  en: {
    name: 'English',
    locale: 'en',
    messages: () => import('@/locales/locale-en.json'),
    intlLocale: () => import('intl/locale-data/jsonp/en'),
    dateFnsLocale: () => import('date-fns/locale/en-US'),
    quasar: () => import('quasar/lang/en-us'),
  },

  eo: {
    name: 'Esperanto',
    locale: 'eo',
    messages: () => import('@/locales/locale-eo.json'),
    intlLocale: () => import('intl/locale-data/jsonp/eo'),
    dateFnsLocale: () => import('date-fns/locale/eo'),
    quasar: () => import('quasar/lang/eo'),
  },

  es: {
    name: 'Español',
    locale: 'es',
    messages: () => import('@/locales/locale-es.json'),
    intlLocale: () => import('intl/locale-data/jsonp/es'),
    dateFnsLocale: () => import('date-fns/locale/es'),
    quasar: () => import('quasar/lang/es'),
  },

  fr: {
    name: 'Français',
    locale: 'fr',
    messages: () => import('@/locales/locale-fr.json'),
    intlLocale: () => import('intl/locale-data/jsonp/fr'),
    dateFnsLocale: () => import('date-fns/locale/fr'),
    quasar: () => import('quasar/lang/fr'),
  },

  gu: {
    name: 'ગુજરાતી',
    locale: 'gu',
    messages: () => import('@/locales/locale-gu.json'),
    intlLocale: () => import('intl/locale-data/jsonp/gu'),
    dateFnsLocale: () => import('date-fns/locale/gu'),
    quasar: () => import('quasar/lang/en-us'), // TODO switch when translated
  },

  hi: {
    name: 'हिन्दी',
    locale: 'hi',
    messages: () => import('@/locales/locale-hi.json'),
    intlLocale: () => import('intl/locale-data/jsonp/hi'),
    dateFnsLocale: () => import('date-fns/locale/hi'),
    quasar: () => import('quasar/lang/en-us'), // TODO switch when translated
  },

  hu: {
    name: 'magyar nyelv',
    locale: 'hu',
    messages: () => import('@/locales/locale-hu.json'),
    intlLocale: () => import('intl/locale-data/jsonp/hu'),
    dateFnsLocale: () => import('date-fns/locale/hu'),
    quasar: () => import('quasar/lang/hu'),
  },

  it: {
    name: 'Italiano',
    locale: 'it',
    messages: () => import('@/locales/locale-it.json'),
    intlLocale: () => import('intl/locale-data/jsonp/it'),
    dateFnsLocale: () => import('date-fns/locale/it'),
    quasar: () => import('quasar/lang/it'),
  },

  ja: {
    name: '日本語',
    locale: 'ja',
    messages: () => import('@/locales/locale-ja.json'),
    intlLocale: () => import('intl/locale-data/jsonp/ja'),
    dateFnsLocale: () => import('date-fns/locale/ja'),
    quasar: () => import('quasar/lang/ja'),
  },

  lb: {
    name: 'Lëtzebuergesch',
    locale: 'lb',
    messages: () => import('@/locales/locale-lb.json'),
    intlLocale: () => import('intl/locale-data/jsonp/lb'),
    dateFnsLocale: () => import('date-fns/locale/lb'),
    quasar: () => import('quasar/lang/lu'),
  },

  mr: {
    name: 'मराठी',
    locale: 'mr',
    messages: () => import('@/locales/locale-mr.json'),
    intlLocale: () => import('intl/locale-data/jsonp/mr'),
    dateFnsLocale: () => import('date-fns/locale/en-US'), // TODO switch when translated
    quasar: () => import('quasar/lang/en-us'), // TODO switch when translated
  },

  pl: {
    name: 'Polski',
    locale: 'pl',
    messages: () => import('@/locales/locale-pl.json'),
    intlLocale: () => import('intl/locale-data/jsonp/pl'),
    dateFnsLocale: () => import('date-fns/locale/pl'),
    quasar: () => import('quasar/lang/pl'),
  },

  pt: {
    name: 'Português',
    locale: 'pt',
    messages: () => import('@/locales/locale-pt.json'),
    intlLocale: () => import('intl/locale-data/jsonp/pt'),
    dateFnsLocale: () => import('date-fns/locale/pt'),
    quasar: () => import('quasar/lang/pt'),
  },

  'pt-br': {
    name: 'Português Brasileiro',
    locale: 'pt-br',
    messages: () => import('@/locales/locale-pt_BR.json'),
    intlLocale: () => import('intl/locale-data/jsonp/pt-BR'),
    dateFnsLocale: () => import('date-fns/locale/pt-BR'),
    quasar: () => import('quasar/lang/pt-br'),
  },

  ru: {
    name: 'Русский',
    locale: 'ru',
    messages: () => import('@/locales/locale-ru.json'),
    intlLocale: () => import('intl/locale-data/jsonp/ru'),
    dateFnsLocale: () => import('date-fns/locale/ru'),
    quasar: () => import('quasar/lang/ru'),
  },

  sv: {
    name: 'Svenska',
    locale: 'sv',
    messages: () => import('@/locales/locale-sv.json'),
    intlLocale: () => import('intl/locale-data/jsonp/sv'),
    dateFnsLocale: () => import('date-fns/locale/sv'),
    quasar: () => import('quasar/lang/sv'),
  },

  'zh-hans': {
    name: '中文 (Simplified)',
    locale: 'zh-hans',
    messages: () => import('@/locales/locale-zh_Hans.json'),
    intlLocale: () => import('intl/locale-data/jsonp/zh-Hans'),
    dateFnsLocale: () => import('date-fns/locale/zh-CN'),
    quasar: () => import('quasar/lang/zh-hans'),
  },

  'zh-hant': {
    name: '中文',
    locale: 'zh-hant',
    messages: () => import('@/locales/locale-zh_Hant.json'),
    intlLocale: () => import('intl/locale-data/jsonp/zh-Hant'),
    dateFnsLocale: () => import('date-fns/locale/zh-TW'),
    quasar: () => import('quasar/lang/zh-hant'),
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
