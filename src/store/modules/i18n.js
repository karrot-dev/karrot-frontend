import i18n from '@/i18n'

export const types = {
  REQUEST_LOCALE: 'Request Locale',
  RECEIVE_LOCALE: 'Receive Locale'
}

export const state = {
  locale: i18n.locale
}

export const actions = {

  async setLocale ({ commit }, { locale }) {
    commit(types.REQUEST_LOCALE)
    i18n.locale = locale
    commit(types.RECEIVE_LOCALE, { locale })
  }

}

export const mutations = {
  [types.REQUEST_LOCALE] (state) {},
  [types.RECEIVE_LOCALE] (state, { locale }) {
    state.locale = locale
  }
}
