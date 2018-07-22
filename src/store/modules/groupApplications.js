import Vue from 'vue'
import groupApplications from '@/services/api/groupApplications'
import router from '@/router'
import { withMeta, createMetaModule, metaStatuses } from '@/store/helpers'

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
    ...metaStatuses(['apply']),
  },
  actions: {
    ...withMeta({
      async apply ({commit}, data) {
        const newApplication = await groupApplications.create(data)
        commit('create', newApplication)
        router.push({ name: 'groupPreview', params: { groupPreviewId: data.group } })
      },
    }),
  },
  mutations: {
    create (state, newApplication) {
      Vue.set(state.entries, newApplication.id, newApplication)
    },
  },
}
