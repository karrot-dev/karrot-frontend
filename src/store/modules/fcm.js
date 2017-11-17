import Vue from 'vue'
import axios from '@/services/axios'

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
    updateToken ({ commit, rootGetters }, token) {
      commit('setToken', token)
    },
    async fetchTokens ({ commit }) {
      commit('receiveTokens', (await axios.get('/api/subscriptions/push/')).data.map(({ token }) => token))
    },
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    receiveTokens (state, tokens) {
      for (let token of tokens) {
        Vue.set(state.tokens, token, true)
      }
    },
  },
}

export const plugin = store => {
  store.watch(() => ({
    isLoggedIn: store.getters['auth/isLoggedIn'],
    token: store.getters['fcm/token'],
  }), async ({ isLoggedIn, token }) => {
    if (isLoggedIn && token) {
      await store.dispatch('fcm/fetchTokens')
      if (!store.getters['fcm/tokenExists'](token)) {
        await axios.post('/api/subscriptions/push/', { token, platform: 'android' })
        await store.dispatch('fcm/fetchTokens')
      }
    }
  })
}
