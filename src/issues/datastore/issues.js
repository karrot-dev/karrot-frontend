import router from '@/base/router'
import Vue from 'vue'
import issuesAPI from '@/issues/api/issues'
import { withMeta, createMetaModule, createPaginationModule } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {
      /* 1: {
        'id': 1,
        'createdAt': '2019-01-21T11:13:17.828Z',
        'group': 13,
        'affectedUser': 222,
        'createdBy': 1,
        'topic': 'He is so unreliable and I cannot stand him!',
        'votings': [{
          'id': 1,
          'acceptedOption': 74,
          'expiresAt': '2019-01-28T11:13:17.828Z',
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
        ],
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
      }, */
    },
    currentId: null,
  }
}
export default {
  namespaced: true,
  state: initialState(),
  modules: {
    meta: createMetaModule(),
    pagination: createPaginationModule(),
  },
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
    getForGroup: (state, getters) => Object.values(state.entries)
      .map(getters.enrich)
      .filter(i => i.group && i.group.isCurrentGroup)
      .sort(sortByCreatedAt),
    getOngoing: (state, getters) => getters.getForGroup.filter(i => i.status === 'ongoing'),
    getPast: (state, getters) => getters.getForGroup.filter(i => i.status !== 'ongoing'),
  },
  actions: {
    ...withMeta({
      async createIssue ({ dispatch, commit }, data) {
        const newIssue = await issuesAPI.create({ affectedUser: data.affectedUser, group: data.group, topic: data.topic })
        commit('update', [newIssue])
        dispatch('toasts/show', {
          message: 'ISSUE.CREATION.TOAST',
        }, { root: true })
        router.push({ name: 'issueTabs', params: { groupId: newIssue.group, issueId: newIssue.id } })
      },
      async fetchByGroupId ({ dispatch, commit }, { groupId }) {
        const issueList = await dispatch('pagination/extractCursor', issuesAPI.list({ group: groupId }))
        commit('update', issueList)
      },
      async fetchOne ({ commit }, data) {
        const currentIssue = await issuesAPI.get(data.issueId)
        commit('setCurrentIssue', data.issueId)
        commit('update', [currentIssue])
      },
      async saveScores ({ commit, dispatch, state }, data) {
        await issuesAPI.vote(state.currentId, data)
        dispatch('toasts/show', {
          message: 'ISSUE.VOTING.TOAST',
        }, { root: true })
        commit('saveScores', data)
      },
    }),
  },
  mutations: {
    setCurrentIssue (state, issueId) {
      state.currentId = issueId
    },
    saveScores (state, results) {
      for (let i = 0; i < results.length; i++) {
        Vue.set(state.entries[state.currentId].votings[0].options[i], 'yourScore', results[i].score)
      }
    },
    update (state, issues) {
      for (const issue of issues) {
        Vue.set(state.entries, issue.id, issue)
      }
    },
  },
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
