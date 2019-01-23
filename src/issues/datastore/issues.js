import router from '@/base/router'
import { withMeta, createMetaModule } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {
      'id': 1,
      'createdAt': '2019-01-15T11:13:17.828Z',
      'group': 13,
      'affectedUser': 4,
      'createdBy': 1,
      'topic': 'He is so unreliable and I cannot stand him!',
    },
  }
}
export default {
  namespaced: true,
  state: initialState(),
  modules: { meta: createMetaModule() },
  getters: {
    get: (state, getters, rootState, rootGetters) => issueId => {
      return getters.enrich(state.entries[issueId])
    },
    enrich: (state, getters, rootState, rootGetters) => issue => {
      return issue && {
        ...issue,
        affectedUser: rootGetters['users/get'](issue.affectedUser),
        group: rootGetters['groups/get'](issue.group),
        createdBy: rootGetters['users/get'](issue.createdBy),
      }
    },
  },
  actions: {
    ...withMeta({
      createIssue () {
        router.push({ name: 'issueTabs', params: { groupId: '13', issueId: '1' } })
      },
    }),
  },
}
