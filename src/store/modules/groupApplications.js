import Vue from 'vue'
import groupApplications from '@/services/api/groupApplications'
import router from '@/router'
import { indexById, withMeta, createMetaModule, metaStatuses } from '@/store/helpers'

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
    get: (state, getters, rootState, rootGetters) => applicationId => {
      return getters.enrich(state.entries[applicationId])
    },
    enrich: (state, getters, rootState, rootGetters) => application => {
      return application && {
        ...application,
        user: rootGetters['users/get'](application.user.id),
        group: rootGetters['groups/get'](application.group),
        decidedBy: rootGetters['users/get'](application.decidedBy),
        isPending: application.status === 'pending',
      }
    },
    getMineForGroupIdNotEnriched: (state, getters, rootState, rootGetters) => groupId => {
      const authUserId = rootGetters['auth/userId']
      if (!authUserId) return
      return Object.values(state.entries).find(a => a.group === groupId && a.user.id === authUserId && a.status === 'pending')
    },
    getForActivePreview: (state, getters, rootState, rootGetters) => {
      const activePreview = rootGetters['groups/activePreview']
      if (!activePreview) return
      return getters.enrich(getters.getMineForGroupIdNotEnriched(activePreview.id))
    },
    getMyInGroup: (state, getters) => groupId => {
      return getters.getMineForGroupIdNotEnriched(groupId)
    },
    forCurrentGroup: (state, getters) => Object.keys(state.entries)
      .map(getters.get)
      .filter(a => a.group && a.group.isCurrentGroup)
      .sort(sortByCreatedAt),
    forCurrentGroupPending: (state, getters) => getters.forCurrentGroup.filter(a => a.isPending),
    forCurrentGroupNonPending: (state, getters) => getters.forCurrentGroup.filter(a => !a.isPending),
    ...metaStatuses(['apply']),
  },
  actions: {
    ...withMeta({
      async fetchMine ({ commit, dispatch, rootGetters }) {
        const userId = rootGetters['auth/userId']
        if (!userId) return
        const applicationList = await groupApplications.list({ user: userId, status: 'pending' })

        if (applicationList.length > 0) {
          commit('set', applicationList)
        }
        applicationList.forEach(a => dispatch('users/update', a.user, { root: true }))
      },

      async fetchByGroupId ({ commit, dispatch }, { groupId }) {
        const applicationList = await groupApplications.list({ group: groupId })
        commit('set', applicationList)
        applicationList.forEach(a => dispatch('users/update', a.user, { root: true }))
      },

      async fetchOne ({ commit, dispatch }, applicationId) {
        const application = await groupApplications.get(applicationId)
        commit('update', application)
        dispatch('users/update', application.user, { root: true })
      },

      async apply ({ commit, dispatch }, data) {
        const newApplication = await groupApplications.create(data)
        commit('update', newApplication)
        dispatch('toasts/show', {
          message: 'JOINGROUP.APPLICATION_SUBMITTED',
        }, { root: true })
        router.push({ name: 'groupPreview', params: { groupPreviewId: data.group } })
      },

      async withdraw ({ commit, dispatch }, id) {
        const removedApplication = await groupApplications.withdraw(id)
        commit('update', removedApplication)
        dispatch('toasts/show', {
          message: 'JOINGROUP.APPLICATION_WITHDRAWN',
        }, { root: true })
      },

      async accept ({ commit, dispatch }, id) {
        const acceptedApplication = await groupApplications.accept(id)
        commit('update', acceptedApplication)
        dispatch('toasts/show', {
          message: 'APPLICATION.ACCEPTED',
          messageParams: { userName: acceptedApplication.user.displayName },
        }, { root: true })
      },

      async decline ({ commit, dispatch }, id) {
        const declinedApplication = await groupApplications.decline(id)
        commit('update', declinedApplication)
        dispatch('toasts/show', {
          message: 'APPLICATION.DECLINED',
          messageParams: { userName: declinedApplication.user.displayName },
        }, { root: true })
      },

    }),
    async maybeFetchOne ({ state, dispatch, getters }, applicationId) {
      const isPending = getters['meta/status']('fetchOne', applicationId).pending
      if (state.entries[applicationId] || isPending) return

      await dispatch('fetchOne', applicationId)
    },
    clearGroupPreviewAndStatus ({ dispatch }) {
      dispatch('meta/clear', ['apply'])
      dispatch('groups/clearGroupPreview', null, { root: true })
    },
    update ({ commit }, application) {
      commit('update', application)
    },
  },
  mutations: {
    set (state, applicationList) {
      state.entries = {
        ...state.entries,
        ...indexById(applicationList),
      }
    },
    update (state, application) {
      Vue.set(state.entries, application.id, application)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
