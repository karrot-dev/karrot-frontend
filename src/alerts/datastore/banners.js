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
      const reconnecting = rootGetters['connectivity/reconnecting']
      const updateAvailable = rootGetters['about/updateAvailable']

      if (updateAvailable && !Platform.is.cordova) {
        banners.push({
          type: 'updateAvailable',
        })
      }

      if (isLoggedIn && !connected) {
        banners.push({
          type: 'notConnected',
          desktopOnly: true,
          context: {
            reconnecting,
          },
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

      banners.push({
        type: 'communityBanner',
        context: {
          // TODO: not sure where we'd really store this number
          // TODO: would be nicer if we can fetch all globally pinned topics, but can't find that in discourse API
          // TODO: ... another option would be an instance configuration to specify them in .env, or in db?
          // TODO: would also need to save when they close it somewhere...
          topicId: 922,
          html: '',
        },
      })

      return banners
    },
  },
}
