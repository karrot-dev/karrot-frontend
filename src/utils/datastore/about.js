// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import about from '@/utils/api/about'
import { Platform } from 'quasar'

function initialState () {
  return {
    deployed: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    deployed: state => state.deployed,
    updateAvailable: state => {
      if (!state.deployed) return
      return state.deployed.commitSHA !== process.env.KARROT.GIT_SHA1
    },
  },
  actions: {
    async fetch ({ commit }) {
      try {
        commit('setDeployed', await about.get())
      }
      catch (e) {}
    },
  },
  mutations: {
    setDeployed (state, deployed) {
      state.deployed = deployed
    },
  },
}

const TEN_MINUTES = 1000 * 60 * 10

export const plugin = datastore => {
  if (!Platform.is.cordova) {
    setInterval(() => datastore.dispatch('about/fetch'), TEN_MINUTES)
  }
}
