import router from '@/base/router'
import { withMeta, createMetaModule } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {
      1: {
        'id': 1,
        'createdAt': '2019-01-15T11:13:17.828Z',
        'group': 13,
        'affectedUser': 222,
        'createdBy': 1,
        'topic': 'He is so unreliable and I cannot stand him!',
        'votings': {
          'id': 1,
          'acceptedOption': 74,
          'expiresAt': '2019-01-22T11:13:17.828Z',
          'options': [{
            'id': 73,
            'sumScore': 7.0,
            'type': 'furtherDiscussion',
            'yourScore': null,
          },
          {
            'id': 74,
            'sumScore': 5.0,
            'type': 'removeUser',
            'yourScore': null,
          },
          { 'id': 75,
            'sumScore': 8.0,
            'type': 'offlineMediation',
            'yourScore': null,
          },
          { 'id': 76,
            'sumScore': -1.0,
            'type': 'noChange',
            'yourScore': null,
          },
          ],
        },
      },
      2: {
        'id': 2,
        'createdAt': '2019-01-15T11:13:17.828Z',
        'group': 13,
        'affectedUser': 222,
        'createdBy': 1,
        'topic': 'She is so unreliable and I cannot stand her!',
      },
    },
    currentId: 1,
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
    getCurrent: (state, getters) => {
      return getters.enrich(state.entries[state.currentId])
    },
  },
  actions: {
    ...withMeta({
      createIssue () {
        router.push({ name: 'issueTabs', params: { groupId: '13', issueId: '1' } })
      },
    }),
    beforeEnter ({ commit }, data) {
      commit('setCurrentIssue', data.issueId)
    },
    saveVotes ({ commit, dispatch }, data) {
      commit('saveVotes', data)
      dispatch('toasts/show', {
        message: 'Your vote was successfully saved.',
      }, { root: true })
    },
  },
  mutations: {
    setCurrentIssue (state, issueId) {
      state.currentId = issueId
    },
    saveVotes (state, votes) {
      state.entries[state.currentId].votings.options[0].yourScore = votes[0]
      state.entries[state.currentId].votings.options[1].yourScore = votes[1]
      state.entries[state.currentId].votings.options[2].yourScore = votes[2]
      state.entries[state.currentId].votings.options[3].yourScore = votes[3]
    },
  },
}
