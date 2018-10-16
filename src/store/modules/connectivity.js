function initialState () {
  return {
    websocket: true, // starting with true prevents warnings on page load
    requestReconnect: false,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    connected: state => state.websocket,
  },
  actions: {
    reconnect ({ commit }) {
      commit('websocket', true) // to react to the button in some way
      commit('requestReconnect', true)
    },
  },
  mutations: {
    websocket (state, data) {
      state.websocket = data
    },
    requestReconnect (state, data) {
      state.requestReconnect = data
    },
  },
}
