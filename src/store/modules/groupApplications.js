import groupApplications from '@/services/api/groupApplications'
import router from '@/router'
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
        await groupApplications.create(data)
        router.push({ name: 'groupPreview', params: { groupPreviewId: data.group } })
      },
    }),
  },
  mutations: {
  },
}
