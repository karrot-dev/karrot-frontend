import Vue from 'vue'
import invitations from '@/services/api/invitations'
import router from '@/router'
import { indexById, createMetaModule, withMeta, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idList: [],
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters) => id => {
      return getters.enrich(state.entries[id])
    },
    enrich: (state, getters, rootState, rootGetters) => invitation => {
      return invitation && {
        ...invitation,
        invitedBy: rootGetters['users/get'](invitation.invitedBy),
      }
    },
    list: (state, getters, rootState, rootGetters) => {
      return state.idList.map(getters.get).sort(sortByCreatedAt)
    },
    ...metaStatuses(['fetch', 'send', 'accept']),
  },
  actions: {
    ...withMeta({
      /**
       * Fetch sent invitations for current group
       */
      async fetch ({ commit, dispatch, rootGetters }) {
        const groupId = rootGetters['group/currentGroupId']
        commit('set', await invitations.listByGroupId(groupId))
      },

      /**
       * Send invitation to e-mail
       */
      async send ({ commit, rootGetters }, email) {
        const invited = await invitations.create({
          email,
          group: rootGetters['currentGroup/id'],
        })
        commit('append', invited)
      },

      /**
       * Accept invitation with token
       */
      async accept ({ commit, dispatch }, token) {
        try {
          await invitations.accept(token)
          // Current group has changed, refresh user data
          await dispatch('auth/check', { root: true })
          dispatch('alerts/create', { type: 'inviteAcceptSuccess' }, { root: true })
          router.push('/')
        }
        catch (error) {
          dispatch('alerts/create', { type: 'inviteAcceptError' }, { root: true })
          router.push({ name: 'groupsGallery' })
          throw error
        }
      },
    }),

    /**
     * Reset all state
     */
    clear ({ commit }) {
      commit('clear')
    },

    add ({ state, commit }, invitation) {
      if (!state.idList.includes(invitation.id)) {
        commit('append', invitation)
      }
    },

    delete ({ commit }, id) {
      commit('delete', id)
    },

    refresh ({ dispatch }) {
      dispatch('fetch')
    },

  },
  mutations: {
    set (state, list) {
      state.entries = indexById(list)
      state.idList = list.map(e => e.id)
    },
    append (state, invited) {
      Vue.set(state.entries, invited.id, invited)
      state.idList.push(invited.id)
    },
    delete (state, id) {
      Vue.delete(state.entries, id)
      const idx = state.idList.indexOf(id)
      if (idx !== -1) state.idList.splice(idx, 1)
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}

export function sortByCreatedAt (a, b) {
  return a.createdAt < b.createdAt
}
