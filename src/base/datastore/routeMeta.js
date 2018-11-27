function initialState () {
  return {
    next: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    pending: state => Boolean(state.next),
  },
  mutations: {
    setNext (state, value) {
      state.next = value
    },
  },
}
