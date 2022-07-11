<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'
=======
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import users from '@/users/api/users'
import { createMetaModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'

function initialState () {
  return {
    success: false,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    success: state => state.success,
    ...metaStatuses(['deleteAccount']),
  },
  actions: {
    ...withMeta({
      async deleteAccount ({ commit }, code) {
        await users.deleteAccount(code)
        commit('setSuccess', true)
      },
    }),
    clear ({ commit, dispatch }) {
      dispatch('meta/clear')
      commit('setSuccess', false)
    },
  },
  mutations: {
    setSuccess (state, status) {
      state.success = status
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export const plugin = datastore => {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.dispatch('deleteAccount/clear')
    }
  })
}
