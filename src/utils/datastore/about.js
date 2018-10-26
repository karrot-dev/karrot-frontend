import about from '@/utils/api/about'
import { Platform } from 'quasar'

function initialState () {
  return {
    deployed: null,
    lastDismissedUpdateSHA: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    deployed: state => state.deployed,
    updateAvailable: state => {
      if (!state.deployed) return
      const alreadyDismissed = state.lastDismissedUpdateSHA === state.deployed.commitSHA
      const differentVersion = state.deployed.commitSHA !== __ENV.GIT_SHA1
      return differentVersion && !alreadyDismissed
    },
  },
  actions: {
    async fetch ({ commit }) {
      try {
        commit('setDeployed', await about.get())
      }
      catch (e) {}
    },
    dismissUpdate ({ commit, getters }) {
      commit('dismissUpdate', getters.deployed.commitSHA)
    },
  },
  mutations: {
    setDeployed (state, deployed) {
      state.deployed = deployed
    },
    dismissUpdate (state, sha) {
      state.lastDismissedUpdateSHA = sha
    },
  },
}

export const plugin = store => {
  const updateAvailable = () => store.getters['about/updateAvailable']
  store.watch(updateAvailable, () => {
    if (!__ENV.DEV && Platform.is.cordova && updateAvailable()) {
      const { apkUrl } = store.getters['about/deployed']
      setTimeout(() => store.dispatch('toasts/show', {
        message: 'UPDATE_AVAILABLE.TITLE',
        detailMessage: 'UPDATE_AVAILABLE.DETAIL',
        config: {
          icon: 'update',
          timeout: 0,
          type: 'info',
          position: 'top',
          actions: [
            {
              icon: 'close',
              handler: () => store.dispatch('about/dismissUpdate'),
            },
            {
              icon: 'cloud_download',
              handler: () => window.open(apkUrl, '_blank'),
            },
          ],
        },
      }), 1000 * 30)
    }
  }, { immediate: true })
}
