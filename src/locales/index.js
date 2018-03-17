// sorted alphabetically
const locales = {
  cs: {
    name: 'Čeština',
    locale: 'cs',
    messages: () => import('@/locales/locale-cs.json'),
    intlLocale: () => import('intl/locale-data/jsonp/cs'),
    dateFnsLocale: () => import('date-fns/locale/cs'),
  },

  de: {
    name: 'Deutsch',
    locale: 'de',
    messages: () => import('@/locales/locale-de.json'),
    intlLocale: () => import('intl/locale-data/jsonp/de'),
    dateFnsLocale: () => import('date-fns/locale/de'),
  },

  en: {
    name: 'English',
    locale: 'en',
    messages: () => import('@/locales/locale-en.json'),
    intlLocale: () => import('intl/locale-data/jsonp/en'),
    dateFnsLocale: () => import('date-fns/locale/en'),
  },

  eo: {
    name: 'Esperanto',
    locale: 'eo',
    messages: () => import('@/locales/locale-eo.json'),
    intlLocale: () => import('intl/locale-data/jsonp/eo'),
    dateFnsLocale: () => import('date-fns/locale/eo'),
  },

  es: {
    name: 'Español',
    locale: 'es',
    messages: () => import('@/locales/locale-es.json'),
    intlLocale: () => import('intl/locale-data/jsonp/es'),
    dateFnsLocale: () => import('date-fns/locale/es'),
  },

  fr: {
    name: 'Français',
    locale: 'fr',
    messages: () => import('@/locales/locale-fr.json'),
    intlLocale: () => import('intl/locale-data/jsonp/fr'),
    dateFnsLocale: () => import('date-fns/locale/fr'),
  },

  gu: {
    name: 'ગુજરાતી',
    locale: 'gu',
    messages: () => import('@/locales/locale-gu.json'),
    intlLocale: () => import('intl/locale-data/jsonp/gu'),
    dateFnsLocale: () => import('date-fns/locale/en'), // TODO switch to Gujarati when datefns supports it
  },

  hi: {
    name: 'हिन्दी',
    locale: 'hi',
    messages: () => import('@/locales/locale-hi.json'),
    intlLocale: () => import('intl/locale-data/jsonp/hi'),
    dateFnsLocale: () => import('date-fns/locale/en'), // TODO switch to Hindi when datefns supports it
  },

  it: {
    name: 'Italiano',
    locale: 'it',
    messages: () => import('@/locales/locale-it.json'),
    intlLocale: () => import('intl/locale-data/jsonp/it'),
    dateFnsLocale: () => import('date-fns/locale/it'),
  },

  pl: {
    name: 'Polski',
    locale: 'pl',
    messages: () => import('@/locales/locale-pl.json'),
    intlLocale: () => import('intl/locale-data/jsonp/pl'),
    dateFnsLocale: () => import('date-fns/locale/pl'),
  },

  ru: {
    name: 'Русский',
    locale: 'ru',
    messages: () => import('@/locales/locale-ru.json'),
    intlLocale: () => import('intl/locale-data/jsonp/ru'),
    dateFnsLocale: () => import('date-fns/locale/ru'),
  },

  sv: {
    name: 'Svenska',
    locale: 'sv',
    messages: () => import('@/locales/locale-sv.json'),
    intlLocale: () => import('intl/locale-data/jsonp/sv'),
    dateFnsLocale: () => import('date-fns/locale/sv'),
  },

  zh: {
    name: '中文',
    locale: 'zh',
    messages: () => import('@/locales/locale-zh.json'),
    intlLocale: () => import('intl/locale-data/jsonp/zh'),
    dateFnsLocale: () => import('date-fns/locale/zh_tw'),
  },
}

export default locales

/**
 * Loading helpers
 */

export function messages (locale) {
  switch (locale) {
    case 'cs': return locales.cs.messages()
    case 'de': return locales.de.messages()
    case 'en': return locales.en.messages()
    case 'eo': return locales.eo.messages()
    case 'es': return locales.es.messages()
    case 'fr': return locales.fr.messages()
    case 'gu': return locales.gu.messages()
    case 'hi': return locales.hi.messages()
    case 'it': return locales.it.messages()
    case 'pl': return locales.pl.messages()
    case 'ru': return locales.ru.messages()
    case 'sv': return locales.sv.messages()
    case 'zh': return locales.zh.messages()
  }
}

export function intlLocale (locale) {
  switch (locale) {
    case 'cs': return locales.cs.IntlData()
    case 'de': return locales.de.IntlData()
    case 'en': return locales.en.IntlData()
    case 'eo': return locales.eo.IntlData()
    case 'es': return locales.es.IntlData()
    case 'fr': return locales.fr.IntlData()
    case 'gu': return locales.gu.IntlData()
    case 'hi': return locales.hi.IntlData()
    case 'it': return locales.it.IntlData()
    case 'pl': return locales.pl.IntlData()
    case 'ru': return locales.ru.IntlData()
    case 'sv': return locales.sv.IntlData()
    case 'zh': return locales.zh.IntlData()
  }
}

export function dateFnsLocale (locale) {
  switch (locale) {
    case 'cs': return locales.cs.dateFnsLocale()
    case 'de': return locales.de.dateFnsLocale()
    case 'en': return locales.en.dateFnsLocale()
    case 'eo': return locales.eo.dateFnsLocale()
    case 'es': return locales.es.dateFnsLocale()
    case 'fr': return locales.fr.dateFnsLocale()
    case 'gu': return locales.gu.dateFnsLocale()
    case 'hi': return locales.hi.dateFnsLocale()
    case 'it': return locales.it.dateFnsLocale()
    case 'pl': return locales.pl.dateFnsLocale()
    case 'ru': return locales.ru.dateFnsLocale()
    case 'sv': return locales.sv.dateFnsLocale()
    case 'zh': return locales.zh.dateFnsLocale()
  }
}
