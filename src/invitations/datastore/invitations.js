import Vue from 'vue'
import invitations from '@/invitations/api/invitations'
import router from '@/base/router'
import { createMetaModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'

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
    get: (state, getters) => id => {
      return getters.enrich(state.entries[id])
    },
    enrich: (state, getters, rootState, rootGetters) => invitation => {
      if (!invitation) return
      return {
        ...invitation,
        invitedBy: rootGetters['users/get'](invitation.invitedBy),
        group: rootGetters['groups/get'](invitation.group),
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return Object.values(state.entries).map(getters.enrich).sort(sortByCreatedAt)
    },
    byCurrentGroup: (state, getters) => {
      return getters.all.filter(({ group }) => group && group.isCurrentGroup)
    },
    ...metaStatuses(['fetch', 'send', 'accept']),
  },
  actions: {
    ...withMeta({
      async send ({ commit, rootGetters }, email) {
        const invited = await invitations.create({
          email,
          group: rootGetters['currentGroup/id'],
        })
        commit('update', [invited])
      },
    }, {
      findId: () => null,
    }),
    ...withMeta({
      /**
       * Fetch sent invitations for current group
       */
      async fetch ({ commit }, { groupId }) {
        commit('update', await invitations.listByGroupId(groupId))
      },

      /**
       * Accept invitation with token
       */
      async accept ({ dispatch }, token) {
        try {
          await invitations.accept(token)
          // Current group has changed, refresh user data
          await dispatch('auth/refresh', { root: true })
          dispatch('toasts/show', {
            message: 'GROUP.INVITATION_ACCEPT_SUCCESS',
          }, { root: true })
          router.push('/')
        }
        catch (error) {
          dispatch('toasts/show', {
            message: 'GROUP.INVITATION_ACCEPT_ERROR',
            config: { type: 'negative' },
          }, { root: true })
          router.push({ name: 'groupsGallery' })
          throw error
        }
      },
    }),

    refresh ({ dispatch, rootGetters }) {
      const groupId = rootGetters['currentGroup/id']
      if (groupId) {
        dispatch('fetch', { groupId })
      }
    },

  },
  mutations: {
    update (state, invitations) {
      for (const invitation of invitations) {
        Vue.set(state.entries, invitation.id, invitation)
      }
    },
    delete (state, id) {
      Vue.delete(state.entries, id)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
