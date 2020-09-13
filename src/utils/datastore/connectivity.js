function initialState () {
  return {
    websocket: true, // starting with true prevents warnings on page load
    requestReconnect: false,
    reconnecting: false,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    connected: state => state.websocket,
    reconnecting: state => state.reconnecting,
  },
  actions: {
    reconnect ({ commit }) {
      commit('requestReconnect', true)
    },
  },
  mutations: {
    websocket (state, data) {
      state.websocket = data
      state.reconnecting = false
    },
    requestReconnect (state, data) {
      state.requestReconnect = data
      if (data === true) {
        state.reconnecting = true
      }
    },
  },
}
