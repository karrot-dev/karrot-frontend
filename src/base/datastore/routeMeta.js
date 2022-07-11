// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
