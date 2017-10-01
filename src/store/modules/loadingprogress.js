export const types = {
  START: 'Start',
  STOP: 'Stop',
  HIDE: 'Hide',
}

export const state = {
  active: false,
  closing: false,
}

export const getters = {
  active: state => state.active,
  closing: state => state.closing,
}

/**
 * To avoid many state mutations, keep the internals separate
 */
let timer = null
let calls = 0
export const actions = {
  start ({ state, commit }) {
    calls++
    if (calls <= 0) {
      // delay at the first request to prevent jitter
      timer = setTimeout(() => commit(types.START), 500)
    }
    else if (state.closing || (calls > 0 && !state.active)) {
      // if we get another request, active directly
      commit(types.START)
      clearTimeout(timer)
    }
  },
  stop ({ state, commit }) {
    calls = Math.max(0, calls - 1)
    if (calls > 0) return

    clearTimeout(timer)
    if (state.active) {
      commit(types.STOP)
      timer = setTimeout(() => commit(types.HIDE), 1500)
    }
  },
}

export const mutations = {
  [types.START] (state) {
    state.active = true
    state.closing = false
  },
  [types.STOP] (state) {
    state.active = false
    state.closing = true
  },
  [types.HIDE] (state) {
    state.active = false
    state.closing = false
  },
}
