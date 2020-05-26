import { Platform } from 'quasar'

export default {
  namespaced: true,
  getters: {
    all: (state, getters, rootState, rootGetters) => {
      const banners = []
      const currentGroup = rootGetters['currentGroup/value']
      const isGroupPage = rootGetters['route/isGroupPage']
      const isLoggedIn = rootGetters['auth/isLoggedIn']
      const connected = rootGetters['connectivity/connected']
      const updateAvailable = rootGetters['about/updateAvailable']

      if (updateAvailable && !Platform.is.cordova) {
        banners.push({
          type: 'updateAvailable',
        })
      }

      if (isLoggedIn && !connected) {
        banners.push({
          type: 'notConnected',
        })
      }

      if (isGroupPage && currentGroup && currentGroup.awaitingAgreement) {
        banners.push({
          type: 'awaitingAgreement',
          context: currentGroup.activeAgreement,
        })
      }

      if (isGroupPage && currentGroup && currentGroup.isPlayground) {
        banners.push({
          type: 'playgroundGroupInfo',
          desktopOnly: true,
        })
      }

      return banners
    },
  },
}
