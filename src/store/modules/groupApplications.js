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
        isPending: application.status === 'pending',
        isDeclined: application.status === 'declined',
        isAccepted: application.status === 'accepted',
        isWithdrawn: application.status === 'withdrawn',
      }
    },
    getByGroupId: state => groupId => {
      return Object.values(state.entries).find(a => a.group === groupId)
    },
    allPending: (state, getters) => Object.keys(state.entries).map(getters.get).filter(a => a.isPending).sort(),
    allNonPending: (state, getters) => Object.keys(state.entries).map(getters.get).filter(a => !a.isPending).sort(),
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
