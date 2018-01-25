function initialState () {
  return {
    floaters: [{id: 2, isOpen: false}, {id: 3, isOpen: false}],
    ids: [2, 3],
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
      commit('open', userId)
      return commit('set', userId)
    },
    open ({ commit }, userId) {
      return commit('open', userId)
    },
    toggleOpen ({ commit }, userId) {
      return commit('toggleOpen', userId)
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
      if (state.ids.indexOf(userId) === -1) {
        if (state.ids.length > 2) {
          state.floaters.shift()
          state.ids.shift()
        }
        state.ids.push(userId)
        state.floaters.push({id: userId, isOpen: true})
      }
      else {
        this.mutations.open(state, userId)
      }
    },
    open (state, userId) {
      let index = state.ids.indexOf(userId)
      if (index > -1) {
        state.floaters[index].isOpen = true
      }
    },
    toggleOpen (state, userId) {
      let index = state.ids.indexOf(userId)
      if (index > -1) {
        state.floaters[index].isOpen = !(state.floaters[index].isOpen)
      }
    },
    remove (state, userId) {
      let index = state.ids.indexOf(userId)
      if (index > -1) {
        state.ids.splice(index, 1)
        state.floaters.splice(index, 1)
      }
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
