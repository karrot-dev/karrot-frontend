<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'
=======
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import auth from '@/authuser/api/auth'
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
    ...metaStatuses(['verify']),
  },
  actions: {
    ...withMeta({
      async verify ({ commit, dispatch, rootGetters }, code) {
        await auth.verifyMail(code)
        commit('setSuccess', true)
        if (rootGetters['auth/isLoggedIn']) {
          dispatch('users/refresh', { userId: rootGetters['auth/userId'] }, { root: true })
          dispatch('auth/refresh', null, { root: true })
        }
      },
    }),
    clear ({ commit, dispatch }) {
      dispatch('meta/clear', ['verify'])
      commit('setSuccess', false)
    },
  },
  mutations: {
    setSuccess (state, status) {
      state.sucess = status
    },
  },
}
