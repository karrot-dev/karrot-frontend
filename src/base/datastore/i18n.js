import locales from '@/locales/index'

export const DEFAULT_LOCALE = 'en'

export function detectLocale () {
  let requested = []
  if (navigator.languages) {
    navigator.languages.forEach(e => {
      requested.push(e.toLowerCase())
      // detect similar languages with slightly less priority
      if (e.includes('-')) {
        requested.push(e.replace(/-.*$/, '').toLowerCase())
      }
      // alias definitions
      else if (e === 'zh') {
        requested.push('zh-hans', 'zh-hant')
      }
      else if (e === 'zh_TW') {
        requested.push('zh-hant')
      }
      else if (e === 'zh_CN') {
        requested.push('zh-hans')
      }
    })
  }
  else {
    let val =
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      navigator.userLanguage
    if (val) {
      requested = [val.toLowerCase()]
    }
  }
  if (requested) {
    return requested.find(e => locales[e])
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
    async setLocale ({ commit, dispatch, rootGetters }, locale) {
      if (rootGetters['auth/isLoggedIn']) {
        dispatch('auth/maybeBackgroundSave', { language: locale }, { root: true })
      }
      commit('set', locale)
    },
  },
  mutations: {
    set (state, locale) {
      state.locale = locale
    },
  },
}
