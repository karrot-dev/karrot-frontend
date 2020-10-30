function initialState () {
  return {
    value: null,
  }
}

export default {
  state: initialState(),
  getters: {
    value: state => state.value,
  },
  mutations: {
    set (state, value) {
      state.value = value
    },
  },
}
