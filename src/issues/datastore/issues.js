import router from '@/base/router'
import Vue from 'vue'
import issuesAPI from '@/issues/api/issues'
import { createMetaModule, createPaginationModule } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {},
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
    current: (state, getters) => {
      return getters.enrich(state.entries[state.currentId])
    },
    forGroup: (state, getters) => Object.values(state.entries)
      .map(getters.enrich)
      .filter(i => i.group && i.group.isCurrentGroup)
      .sort(sortByCreatedAt),
    ongoing: (state, getters) => getters.forGroup.filter(i => i.status === 'ongoing'),
    past: (state, getters) => getters.forGroup.filter(i => i.status !== 'ongoing'),
  },
  actions: {
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
