import applications from '@/applications/api/applications'
import router from '@/base/router'
import { withMeta, createMetaModule, metaStatuses, createPaginationModule, indexById } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {},
  }
}
export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    pagination: createPaginationModule(),
  },
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
        canDecide: application.status === 'pending' && rootGetters['currentGroup/isEditor'],
      }
    },
    getMineInGroup: (state, getters, rootState, rootGetters) => groupId => {
      const authUserId = rootGetters['auth/userId']
      if (!authUserId) return
      return Object.values(state.entries).find(a => a.group === groupId && a.user.id === authUserId && a.status === 'pending')
    },
    getForActivePreview: (state, getters, rootState, rootGetters) => {
      const activePreview = rootGetters['groups/activePreview']
      if (!activePreview) return
      return getters.enrich(getters.getMineInGroup(activePreview.id))
    },
    forCurrentGroup: (state, getters) => Object.keys(state.entries)
      .map(getters.get)
      .filter(a => a.group && a.group.isCurrentGroup)
      .sort(sortByCreatedAt),
    forCurrentGroupPending: (state, getters) => getters.forCurrentGroup.filter(a => a.isPending),
    forCurrentGroupNonPending: (state, getters) => getters.forCurrentGroup.filter(a => !a.isPending),
    canFetchPast: (state, getters) => getters['pagination/canFetchNext'],
    ...metaStatuses(['apply', 'fetchPast']),
  },
  actions: {
    async fetch ({ commit, dispatch }, filters) {
      const applicationList = await dispatch('pagination/extractCursor', applications.list(filters))
      commit('update', applicationList)

      const users = applicationList.map(a => a.user)
      commit('users/update', users, { root: true })
    },
    ...withMeta({
      async fetchMine ({ dispatch, rootGetters }) {
        const userId = rootGetters['auth/userId']
        if (!userId) return
        await dispatch('fetch', { user: userId, status: 'pending' })
      },

      async fetchByGroupId ({ dispatch }, { groupId }) {
        await dispatch('fetch', { group: groupId })
      },

      async fetchPendingByGroupId ({ dispatch }, { groupId }) {
        await dispatch('fetch', { group: groupId, status: 'pending' })
      },

      async fetchPast ({ commit, dispatch }) {
        const applicationList = await dispatch('pagination/fetchNext', applications.listMore)
        commit('update', applicationList)

        const users = applicationList.map(a => a.user)
        commit('users/update', users, { root: true })
      },

      async fetchOne ({ commit }, applicationId) {
        const application = await applications.get(applicationId)
        commit('update', [application])

        commit('users/update', [application.user], { root: true })
      },

      async apply ({ commit, dispatch }, data) {
        const newApplication = await applications.create(data)
        commit('update', [newApplication])
        dispatch('toasts/show', {
          message: 'JOINGROUP.APPLICATION_SUBMITTED',
        }, { root: true })
        router.push({ name: 'groupPreview', params: { groupPreviewId: data.group } }).catch(() => {})
      },

      async withdraw ({ commit, dispatch }, id) {
        const removedApplication = await applications.withdraw(id)
        commit('update', [removedApplication])
        dispatch('toasts/show', {
          message: 'JOINGROUP.APPLICATION_WITHDRAWN',
        }, { root: true })
      },

      async accept ({ commit, dispatch }, id) {
        const acceptedApplication = await applications.accept(id)
        commit('update', [acceptedApplication])
        dispatch('toasts/show', {
          message: 'APPLICATION.ACCEPTED',
          messageParams: { userName: acceptedApplication.user.displayName },
        }, { root: true })
      },

      async decline ({ commit, dispatch }, id) {
        const declinedApplication = await applications.decline(id)
        commit('update', [declinedApplication])
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
  },
  mutations: {
    update (state, applications) {
      state.entries = { ...state.entries, ...indexById(applications) }
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
