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
    list: state => state.idList.map(i => state.entries[i]),
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
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}
