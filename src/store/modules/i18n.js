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

export const types = {
  REQUEST_LOCALE: 'Request Locale',
  RECEIVE_LOCALE: 'Receive Locale',
}

function initialState () {
  return {
    locale: detectLocale() || DEFAULT_LOCALE,
  }
}

export const state = initialState()

export const getters = {
  getLocale: state => state.locale,
}

export const actions = {

  async setLocale ({ commit, dispatch }, locale) {
    commit(types.REQUEST_LOCALE)
    dispatch('auth/update', { language: locale }, { root: true })
    commit(types.RECEIVE_LOCALE, { locale })
  },

}

export const mutations = {
  [types.REQUEST_LOCALE] (state) {},
  [types.RECEIVE_LOCALE] (state, { locale }) {
    state.locale = locale
  },
}
