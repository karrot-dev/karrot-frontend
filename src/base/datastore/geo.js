function initialState () {
  return {
    value: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    myCoordinates: state => state.value,
  },
  mutations: {
    set (state, value) {
      state.value = value
    },
  },
}
