// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
      if (!state.value) return null
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
