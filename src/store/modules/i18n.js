export const DEFAULT_LOCALE = 'en'

export function detectLocale () {
  // Based on https://angular-translate.github.io/docs/#/guide/07_multi-language#multi-language_determining-preferred-language-automatically
  let val =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.browserLanguage ||
    navigator.systemLanguage ||
    navigator.userLanguage
  if (val) {
    return val.replace(/-.*$/, '')
  }
}

function initialState () {
  return {
    locale: detectLocale() || DEFAULT_LOCALE,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    locale: state => state.locale,
  },
  actions: {
    async setLocale ({ commit, dispatch }, locale) {
      dispatch('auth/update', { language: locale }, { root: true })
      commit('set', locale)
    },
  },
  mutations: {
    set (state, locale) {
      state.locale = locale
    },
  },
}
