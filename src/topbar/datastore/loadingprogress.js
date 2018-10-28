function initialState () {
  return {
    active: false,
    closing: false,
  }
}

// 'internal' state
let timer = null
let calls = 0

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    active: state => state.active,
    closing: state => state.closing,
  },
  actions: {
    start ({ state, commit }) {
      calls++
      if (calls <= 0) {
        // delay at the first request to prevent jitter
        timer = setTimeout(() => commit('start'), 500)
      }
      else if (state.closing || (calls > 0 && !state.active)) {
        // if we get another request, active directly
        commit('start')
        clearTimeout(timer)
      }
    },
    stop ({ state, commit }) {
      calls = Math.max(0, calls - 1)
      if (calls > 0) return

      clearTimeout(timer)
      if (state.active) {
        commit('stop')
        timer = setTimeout(() => commit('hide'), 1500)
      }
    },
  },
  mutations: {
    start (state) {
      state.active = true
      state.closing = false
    },
    stop (state) {
      state.active = false
      state.closing = true
    },
    hide (state) {
      state.active = false
      state.closing = false
    },
  },
}
