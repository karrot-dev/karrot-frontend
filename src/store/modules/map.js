function initialState () {
  return {
    showStores: true,
    showUsers: false,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    showStores: state => state.showStores,
    showUsers: state => state.showUsers,
  },
  mutations: {
    toggleStores (state) {
      state.showStores = !state.showStores
    },
    toggleUsers (state) {
      state.showUsers = !state.showUsers
    },
  },
}

export const state = initialState()
