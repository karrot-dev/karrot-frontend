// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

function initialState () {
  return {
    hasError: false,
    message: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    status: state => state,
  },
  actions: {
    set ({ commit }, message) {
      return commit('set', message)
    },
    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    set (state, message) {
      state.hasError = true
      state.message = message
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
