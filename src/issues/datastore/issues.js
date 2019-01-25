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
    past: {
      3: {
        'id': 3,
        'createdAt': '2019-01-01T11:13:17.828Z',
        'group': 13,
        'affectedUser': 222,
        'createdBy': 1,
        'topic': 'We should talk about this attitude, mister...',
      },
      4: {
        'id': 4,
        'createdAt': '2018-05-21T11:13:17.828Z',
        'group': 13,
        'affectedUser': 222,
        'createdBy': 1,
        'topic': 'I have a problem with how you behave in front of store employees. I think it makes us look unprofessional and impolite.',
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
    getOngoing: (state, getters) => Object.values(state.entries).sort(sortByCreatedAt),
    getPast: (state, getters) => Object.values(state.past),
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
    openOne (data) {
      console.log('In the store: ', data)
      const { id, group } = data
      router.push({ name: 'issueTabs', params: { groupId: group.id, issueId: id } })
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

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
