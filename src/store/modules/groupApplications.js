import groupApplications from '@/services/api/groupApplications'
import { withMeta, createMetaModule, metaStatuses } from '@/store/helpers'

function initialState () {
  return {}
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
        const groupAppliedTo = await groupApplications.create(data)
        commit('update', groupAppliedTo)
        // dispatch an event that injects the answers into the applchat
        // router.push({ name: 'groupPreview', params: { groupId: groupPreviewId } })
      },
    }),
  },
  mutations: {
  },
}
