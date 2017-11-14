import Vue from 'vue'
import invitations from '@/services/api/invitations'
import router from '@/router'
import { indexById, createMetaModule, withMeta, metaStatuses } from '@/store/helpers'

export const modules = { meta: createMetaModule() }

export const types = {
  RECEIVE: 'Receive',
  APPEND: 'Append',
  CLEAR: 'Clear',
}

function initialState () {
  return {
    entries: {},
    idList: [],
  }
}

export const state = initialState()

export const getters = {
  list: state => state.idList.map(i => state.entries[i]),
  ...metaStatuses(['fetch', 'send', 'accept']),
}

export const actions = {
  ...withMeta({
    /**
     * Fetch sent invitations for active group
     */
    async fetch ({ commit, dispatch, rootGetters }) {
      const groupId = rootGetters['group/activeGroupId']
      commit(types.RECEIVE, { list: await invitations.listByGroupId(groupId) })
    },

    /**
     * Send invitation to e-mail
     */
    async send ({ commit, rootGetters }, email) {
      const invited = await invitations.create({
        email,
        group: rootGetters['groups/activeGroupId'],
      })
      commit(types.APPEND, { invited })
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
    commit(types.CLEAR)
  },
}

export const mutations = {
  [types.RECEIVE] (state, { list }) {
    state.entries = indexById(list)
    state.idList = list.map(e => e.id)
  },
  [types.APPEND] (state, { invited }) {
    Vue.set(state.entries, invited.id, invited)
    state.idList.push(invited.id)
  },

  [types.CLEAR] (state) {
    Object.entries(initialState())
      .forEach(([prop, value]) => Vue.set(state, prop, value))
  },
}
