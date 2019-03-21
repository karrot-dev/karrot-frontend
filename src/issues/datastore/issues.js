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
        isSelected: issue.id === state.currentId,
        votings: issue.votings.map(voting => ({
          ...voting,
          options: voting.options.map(option => ({
            ...option,
            meanScore: voting.participantCount ? option.sumScore / voting.participantCount : null,
          })),
        })),
      }
    },
    current: (state, getters) => {
      return getters.enrich(state.entries[state.currentId])
    },
    currentId: (state) => {
      return state.currentId
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
    ...metaStatuses(['create', 'fetchByGroupId', 'saveVote']),
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
      async fetchOngoingByGroupId ({ commit }, { groupId }) {
        const issueList = (await issuesAPI.list({ group: groupId, status: 'ongoing' })).results
        commit('update', issueList)
      },
      async fetchByGroupId ({ dispatch, commit }, { groupId }) {
        const issueList = await dispatch('pagination/extractCursor', issuesAPI.list({ group: groupId }))
        commit('update', issueList)
      },
      async fetchOne ({ commit }, issueId) {
        const currentIssue = await issuesAPI.get(issueId)
        commit('update', [currentIssue])
      },
      async saveVote ({ dispatch, state }, data) {
        await issuesAPI.vote(state.currentId, data)
        dispatch('toasts/show', {
          message: 'ISSUE.VOTING.TOAST',
        }, { root: true })
      },
      async deleteVote ({ dispatch, state }) {
        await issuesAPI.deleteVote(state.currentId)
        dispatch('toasts/show', {
          message: 'ISSUE.VOTING.TOAST_DELETE',
        }, { root: true })
      },
    }),
    ...withMeta({
      async select ({ commit, dispatch }, { issueId }) {
        // clear right drawer
        // TODO can be removed once detail are bound to routes
        dispatch('detail/clear', null, { root: true })

        await dispatch('maybeFetchOne', issueId)
        dispatch('conversations/fetchForIssue', { issueId }, { root: true })
      },
    }, {
      setCurrentId: ({ commit }, { issueId }) => commit('setCurrentIssue', issueId),
      getCurrentId: ({ state }) => state.currentId,
      findId: ({ issueId }) => issueId,
    }),
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
    clear (state) {
      Object.assign(state, initialState())
    },
    clearForGroup (state, groupId) {
      const toClear = Object.entries(state.entries).filter(([_, v]) => v.group === groupId).map(([k]) => k)
      toClear.forEach(idx => Vue.delete(state.entries, idx))
    },
  },
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
