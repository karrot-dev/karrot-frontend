import router from '@/base/router'
import Vue from 'vue'
import issuesAPI from '@/issues/api/issues'
import { createMetaModule, createPaginationModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'

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
        isCancelled: issue.status === 'cancelled',
        isOngoing: issue.status === 'ongoing',
      }
    },
    current: (state, getters) => {
      return getters.enrich(state.entries[state.currentId])
    },
    currentConversation: (state, getters, rootState, rootGetters) => {
      if (!state.currentId) return
      return rootGetters['conversations/getForIssue'](state.currentId)
    },
    forGroup: (state, getters) => Object.values(state.entries)
      .map(getters.enrich)
      .filter(i => i.group && i.group.isCurrentGroup)
      .sort(sortByCreatedAt),
    ongoing: (state, getters) => getters.forGroup.filter(i => i.isOngoing),
    past: (state, getters) => getters.forGroup.filter(i => !i.isOngoing),
    ...metaStatuses(['create', 'fetchByGroupId']),
  },
  actions: {
    ...withMeta({
      async create ({ dispatch, commit }, data) {
        const newIssue = await issuesAPI.create({ affectedUser: data.affectedUser, group: data.group, topic: data.topic })
        commit('update', [newIssue])
        dispatch('toasts/show', {
          message: 'ISSUE.CREATION.TOAST',
        }, { root: true })
        router.push({ name: 'issueDetail', params: { groupId: newIssue.group, issueId: newIssue.id } })
      },
      async fetchByGroupId ({ dispatch, commit }, { groupId }) {
        const issueList = await dispatch('pagination/extractCursor', issuesAPI.list({ group: groupId }))
        commit('update', issueList)
      },
    }),
    ...withMeta({
      async fetchOne ({ commit }, issueId) {
        const currentIssue = await issuesAPI.get(issueId)
        commit('update', [currentIssue])
      },
    }),
    ...withMeta({
      async select ({ commit, dispatch }, { issueId }) {
        // clear right drawer
        // TODO can be removed once detail are bound to routes
        dispatch('detail/clear', null, { root: true })

        await dispatch('maybeFetchOne', issueId)
        dispatch('conversations/fetchForIssue', { issueId }, { root: true })
        commit('setCurrentIssue', issueId)
      },
    }, {
      findId: ({ issueId }) => issueId,
    }),
    async saveScores ({ commit, dispatch, state }, data) {
      await issuesAPI.vote(state.currentId, data)
      dispatch('toasts/show', {
        message: 'ISSUE.VOTING.TOAST',
      }, { root: true })
    },
    async maybeFetchOne ({ state, dispatch, getters }, issueId) {
      const isPending = getters['meta/status']('fetchOne', issueId).pending
      if (state.entries[issueId] || isPending) return

      await dispatch('fetchOne', issueId)
    },
  },
  mutations: {
    setCurrentIssue (state, issueId) {
      state.currentId = issueId
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
