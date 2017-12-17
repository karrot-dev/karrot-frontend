function initialState () {
  return {
    hasError: false,
    message: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    status: state => state,
  },
  actions: {
    set ({ commit }, message) {
      return commit('set', message)
    },
    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    set (state, message) {
      state.hasError = true
      state.message = message
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
