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
        user: rootGetters['users/enrich'](application.user),
        group: rootGetters['groups/get'](application.group),
        decidedBy: rootGetters['users/get'](application.decidedBy),
        isPending: application.status === 'pending',
      }
    },
    getMineForGroupIdNotEnriched: (state, getters, rootState, rootGetters) => groupId => {
      const authUserId = rootGetters['auth/userId']
      return Object.values(state.entries).find(a => a.group === groupId && a.user.id === authUserId)
    },
    getForActivePreview: (state, getters, rootState, rootGetters) => {
      const activePreview = rootGetters['groups/activePreview']
      if (!activePreview) return
      return getters.enrich(getters.getMineForGroupIdNotEnriched(activePreview.id))
    },
    groupHasMyApplication: (state, getters) => groupId => {
      return Boolean(getters.getMineForGroupIdNotEnriched(groupId))
    },
    pending: (state, getters) => Object.keys(state.entries).map(getters.get).filter(a => a.isPending).sort(sortByCreatedAt),
    allNonPending: (state, getters) => Object.keys(state.entries).map(getters.get).filter(a => !a.isPending).sort(sortByCreatedAt),
    ...metaStatuses(['apply']),
  },
  actions: {
    ...withMeta({

      async fetchMine ({ commit, rootGetters }) {
        const userId = rootGetters['auth/userId']
        const applicationList = await groupApplications.list({ user: userId, status: 'pending' })
        commit('set', applicationList)
      },

      async fetchByGroupId ({ commit, getters }, { groupId }) {
        const applicationList = await groupApplications.list({ group: groupId })
        commit('set', applicationList)
      },

      async fetchOne ({ commit }, applicationId) {
        const application = await groupApplications.get(applicationId)
        commit('set', [application])
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
        commit('delete', removedApplication.id)
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
    async maybeFetchOne ({ state, dispatch }, applicationId) {
      if (state.entries[applicationId]) return
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
      state.entries = indexById(applicationList)
    },
    delete (state, id) {
      if (state.entries[id]) Vue.delete(state.entries, id)
    },
    update (state, application) {
      Vue.set(state.entries, application.id, application)
    },
  },
}

export function sortByCreatedAt (a, b) {
  return a.createdAt < b.createdAt
}
