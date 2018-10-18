import Vue from 'vue'
import subscriptionsAPI from '@/services/api/subscriptions'

export default {
  namespaced: true,
  state: {
    token: null,
    tokens: {},
  },
  getters: {
    token: state => state.token,
    tokenExists: state => token => Boolean(state.tokens[token]),
  },
  actions: {
    updateToken ({ commit }, token) {
      commit('setToken', token)
    },
    async fetchTokens ({ commit }) {
      const tokens = await subscriptionsAPI.list()
      commit('receiveTokens', tokens.map(({ token }) => token))
    },
    async disable ({ state }) {
      if (!state.token) return
      const subscriptions = await subscriptionsAPI.list()
      const subscription = subscriptions.find(({ token }) => token === state.token)
      if (!subscription) return
      await subscriptionsAPI.delete(subscription.id)
    },
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    receiveTokens (state, tokens) {
      state.tokens = {}
      for (let token of tokens) {
        Vue.set(state.tokens, token, true)
      }
    },
  },
}

export const plugin = store => {
  store.watch((state, getters) => ({
    isLoggedIn: getters['auth/isLoggedIn'],
    token: getters['fcm/token'],
  }), async ({ isLoggedIn, token }) => {
    if (isLoggedIn && token) {
      await store.dispatch('fcm/fetchTokens')
      if (!store.getters['fcm/tokenExists'](token)) {
        await subscriptionsAPI.create({ token, platform: 'android' })
        await store.dispatch('fcm/fetchTokens')
      }
    }
  })
}
