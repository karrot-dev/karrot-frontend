import Vue from 'vue'
import groupApplications from '@/services/api/groupApplications'
import router from '@/router'
import { indexById, withMeta, createMetaModule, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
  }
}
export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    getByGroupId: state => groupId => {
      return Object.values(state.entries).find(a => a.group === groupId)
    },
    all: state => Object.values(state.entries),
    ...metaStatuses(['apply']),
  },
  actions: {
    ...withMeta({
      async apply ({commit}, data) {
        const newApplication = await groupApplications.create(data)
        commit('create', newApplication)
        router.push({ name: 'groupPreview', params: { groupPreviewId: data.group } })
      },

      async fetchMine ({ commit, rootGetters }) {
        const userId = rootGetters['auth/userId']
        const applicationList = await groupApplications.list({ user: userId, status: 'pending' })
        commit('set', applicationList)
      },

      async fetchByGroupId ({ commit, getters }, groupId) {
        const applicationList = await groupApplications.list({ group: groupId })
        commit('set', applicationList)
      },

      async withdraw ({ commit }, applicationId) {
        const removedApplication = await groupApplications.withdraw(applicationId)
        commit('delete', removedApplication.id)
      },

    }),
    clearGroupPreviewAndStatus ({ dispatch }) {
      dispatch('meta/clear', ['apply'])
      dispatch('groups/clearGroupPreview', null, { root: true })
    },
  },
  mutations: {
    create (state, newApplication) {
      Vue.set(state.entries, newApplication.id, newApplication)
    },
    set (state, applicationList) {
      state.entries = indexById(applicationList)
    },
    delete (state, id) {
      Vue.delete(state.entries, id)
    },
  },
}
