export const types = {
  SET: 'Set',
  CLEAR: 'Clear',
}

function initialState () {
  return {
    hasError: false,
    message: null,
  }
}

export const state = initialState()

export const getters = {
  status: (state, getters, rootState, rootGetters) => state,
}

export const actions = {
  set ({ commit }, message) {
    return commit(types.SET, { message })
  },

  clear ({ commit }) {
    commit(types.CLEAR)
  },
}

export const mutations = {
  [types.SET] (state, { message }) {
    state.hasError = true
    state.message = message
  },

  [types.CLEAR] (state) {
    Object.assign(state, initialState())
  },
}
