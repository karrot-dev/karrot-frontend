import groups from '@/services/api/groups'
import { withMeta, createMetaModule, withPrefixedIdMeta, createRouteRedirect } from '@/store/helpers'

function initialState () {
  return {
    current: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    value: (state, getters) => getters.enrich(state.current),
    enrich: (state, getters, rootState, rootGetters) => group => {
      if (!group) return
      const isPlayground = group.status === 'playground'
      return {
        ...group,
        isPlayground,
        membership: getters.membership,
        memberships: getters.memberships,
        activeAgreement: getters.activeAgreement,
        awaitingAgreement: !!(getters.activeAgreement && getters.activeAgreement.agreed === false),
      }
    },
    memberships: (state, getters, rootState, rootGetters) => {
      const group = state.current
      if (!group) return []
      return Object.entries(group.memberships).reduce((obj, [userId, membership]) => {
        const enrichedMembership = rootGetters['users/enrichMembership'](membership)
        obj[userId] = {
          ...enrichedMembership,
          trustProgress: enrichedMembership.isEditor ? 1 : enrichedMembership.trustedBy.length / state.current.trustThresholdForNewcomer,
        }
        return obj
      }, {})
    },
    agreement: (state, getters, rootState, rootGetters) => state.current && rootGetters['agreements/get'](state.current.activeAgreement),
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.current) return
      return rootGetters['conversations/getForGroup'](state.current.id)
    },
    id: (state) => state.current && state.current.id,
    // for current user:
    membership: (state, getters, rootState, rootGetters) => getters.memberships[rootGetters['auth/userId']],
    roles: (state, getters) => getters.membership ? getters.value.membership.roles : [],
    isEditor: (state, getters) => getters.roles.includes('editor'),
  },
  actions: {
    ...withMeta({
      async fetch ({ commit, rootGetters, dispatch }, groupId) {
        const group = await groups.get(groupId)
        if (group.activeAgreement) {
          dispatch('agreements/fetch', group.activeAgreement, { root: true })
        }
        commit('set', group)
      },

      async markUserActive ({ getters }) {
        /**
         * Marks the user as active in the current group
         * Should only be triggered when the user visits a group page
         * It currently also gets triggered when the user visits the profile page, but that seems fine.
        */
        if (getters.id) await groups.markUserActive(getters.id)
      },

      async changeNotificationType ({ commit, dispatch, getters }, { notificationType, enabled }) {
        if (enabled) {
          await groups.addNotificationType(getters.id, notificationType)
        }
        else {
          await groups.removeNotificationType(getters.id, notificationType)
        }
        await dispatch('fetch', getters.id)
      },

    }),

    ...withPrefixedIdMeta('agreements/', {

      async agreementSave ({ commit, dispatch, state, getters }, agreement) {
        const { id } = agreement
        if (id) {
          agreement = await dispatch('agreements/save', agreement, { root: true })
        }
        else {
          agreement = await dispatch('agreements/create', { ...agreement, group: getters.id }, { root: true })
        }

        if (state.current.activeAgreement !== agreement.id) {
          commit('set', await groups.save({ id: getters.id, activeAgreement: agreement.id }))
        }
      },

      async agreementReplace ({ commit, dispatch, state, getters }, agreement) {
        agreement = await dispatch('agreements/create', { ...agreement, group: getters.id }, { root: true })
        commit('set', await groups.save({ id: getters.id, activeAgreement: agreement.id }))
      },

      async agreementRemove ({ commit, dispatch, state, getters }) {
        commit('set', await groups.save({ id: getters.id, activeAgreement: null }))
      },

    }),

    async select ({ dispatch, getters, rootGetters }, { groupId }) {
      if (!groupId) throw createRouteRedirect({ name: 'groupsGallery' })
      if (getters.id === groupId) return

      await dispatch('fetch', groupId)
      const hasError = getters['meta/status']('fetch', groupId).hasValidationErrors
      if (hasError) {
        const groupExists = Boolean(rootGetters['groups/get'](groupId))
        if (groupExists) {
          dispatch('toasts/show', {
            message: 'GROUP.NONMEMBER_REDIRECT',
            config: {
              type: 'negative',
            },
          }, { root: true })
        }
        throw createRouteRedirect({ name: 'groupPreview', params: {groupPreviewId: groupId} })
      }

      dispatch('pickups/clear', {}, { root: true })

      dispatch('pickups/fetchListByGroupId', groupId, { root: true })
      dispatch('pickups/fetchFeedbackPossible', groupId, { root: true })

      dispatch('groupApplications/fetchByGroupId', { groupId }, { root: true })

      dispatch('auth/maybeBackgroundSave', { currentGroup: groupId }, { root: true })
    },

    selectFromCurrentUser ({ dispatch, getters, rootGetters }) {
      const selected = getters.id
      const groupId = rootGetters['auth/user'].currentGroup
      if (!selected && groupId) {
        dispatch('select', { groupId })
      }
    },

    clear ({ commit, dispatch }) {
      commit('clear')
      dispatch('auth/maybeBackgroundSave', { currentGroup: null }, { root: true })
      dispatch('agreements/clear', null, { root: true })
      dispatch('pickups/clear', {}, { root: true })
      dispatch('feedback/clear', null, { root: true })
    },

    update ({ state, commit }, group) {
      // update group values, do not replace group
      if (group.id === state.current.id) {
        commit('set', group)
      }
    },

    refresh ({ state, dispatch }) {
      if (state.current) {
        dispatch('fetch', state.current.id)
      }
    },
  },
  mutations: {
    set (state, group) {
      state.current = group
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
