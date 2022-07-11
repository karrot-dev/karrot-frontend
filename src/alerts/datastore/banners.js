// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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

      return banners
    },
  },
}
