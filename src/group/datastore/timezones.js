// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import groups from '@/group/api/groups'
import { withMeta, createMetaModule } from '@/utils/datastore/helpers'

function initialState () {
  return {
    timezones: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    autocompleteData: state => {
      if (state.timezones) {
        return state.timezones.allTimezones
      }
      return []
    },
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }) {
        commit('set', await groups.timezones())
      },
    }),
  },
  mutations: {
    set (state, timezones) {
      state.timezones = timezones
    },
  },
}
