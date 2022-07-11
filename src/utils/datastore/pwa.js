// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

function initialState () {
  return {
    installPrompt: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    installPrompt: state => state.installPrompt,
  },
  mutations: {
    setInstallPrompt (state, v) {
      state.installPrompt = v
    },
  },
}

export function plugin (datastore) {
  window.addEventListener('appinstalled', () => {
    datastore.dispatch('toasts/show', {
      message: 'GLOBAL.APP_INSTALLED',
    })
  })
}
