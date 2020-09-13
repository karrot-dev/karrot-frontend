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
