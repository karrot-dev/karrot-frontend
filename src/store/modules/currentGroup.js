import groups from '@/services/api/groups'
import { withMeta, createMetaModule, withPrefixedIdMeta, createRouteError } from '@/store/helpers'

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
    get: (state, getters) => getters.enrich(state.active) || {},
    enrich: (state, getters, rootState, rootGetters) => group => {
      if (!group) return
      const userId = rootGetters['auth/userId']
      const activeAgreement = rootGetters['agreements/get'](group.activeAgreement)
      const membership = group.memberships ? group.memberships[userId] : {}
      return {
        ...group,
        membership,
        activeAgreement,
        awaitingAgreement: !!(activeAgreement && activeAgreement.agreed === false),
        __unenriched: group,
      }
    },
    roles: (state, getters) => getters.get.membership ? getters.get.membership.roles : [],
    agreement: (state, getters) => getters.get && getters.get.activeAgreement,
    id: (state) => state.current.id,
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

    async selectGroup ({ commit, state, dispatch, getters, rootState, rootGetters }, { groupId }) {
      if (getters.id === groupId) return

      await dispatch('fetch', groupId)
      const hasError = getters['meta/status']('fetch', groupId).hasValidationErrors
      if (hasError) {
        const groupExists = !!rootGetters.get('groups/get')(groupId)
        const data = { translation: groupExists ? 'GROUP.NONMEMBER_REDIRECT' : 'NOT_FOUND.EXPLANATION' }
        throw createRouteError(data)
      }

      dispatch('pickups/clear', {}, { root: true })

      dispatch('pickups/fetchListByGroupId', groupId, { root: true })
      try {
        dispatch('conversations/setActive', await groups.conversation(groupId), {root: true})
      }
      catch (error) {
        dispatch('conversations/clearActive', {}, { root: true })
      }

      dispatch('auth/update', { currentGroup: groupId }, { root: true })
    },
  },
  mutations: {
    'set' (state, group) {
      state.current = group
    },
  },
}
