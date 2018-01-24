function initialState () {
  return {
    floaters: [1, 2],
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    all: state => state.floaters,
  },
  actions: {
    add ({ commit }, userId) {
      return commit('set', userId)
    },
    remove ({ commit }, userId) {
      return commit('remove', userId)
    },
    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    set (state, userId) {
      if (state.floaters.indexOf(userId) === -1) {
        if (state.floaters.length > 2) {
          state.floaters.shift()
        }
        state.floaters.push(userId)
      }
    },
    remove (state, userId) {
      let index = state.floaters.indexOf(userId)
      if (index > -1) {
        state.floaters.splice(index, 1)
      }
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
