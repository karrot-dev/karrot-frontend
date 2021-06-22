function initialState () {
  return {
    value: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    myCoordinates: state => {
      const { lat, lng } = state.value
      return { lat, lng }
    },
  },
  mutations: {
    set (state, value) {
      state.value = value
    },
  },
}
