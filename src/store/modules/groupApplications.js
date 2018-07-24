import Vue from 'vue'
import groupApplications from '@/services/api/groupApplications'
import router from '@/router'
import { withMeta, createMetaModule, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    list: [],
  }
}
export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    getByGroupId: state => groupId => {
      return state.list.find(a => a.group === groupId)
    },
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
        const applicationList = await groupApplications.list({ user: userId })
        commit('set', applicationList)
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
      state.list = applicationList
    },
  },
}
