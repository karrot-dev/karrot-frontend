import groups from '@/group/api/groups'
import {
  createMetaModule,
  createRouteRedirect,
  withMeta,
} from '@/utils/datastore/helpers'

function initialState () {
  return {
    current: null,
    id: null,
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
        isBikeKitchen: group.theme === 'bikekitchen',
        isGeneralPurpose: group.theme === 'general',
        hasPhoto: group.photoUrls && group.photoUrls.fullSize,
        hasLocation: group.latitude && group.longitude,
        membership: getters.membership,
        memberships: getters.memberships,
      }
    },
    memberships: (state, getters, rootState, rootGetters) => {
      const group = state.current
      if (!group || !group.memberships) return []
      return Object.entries(group.memberships).reduce((obj, [userId, membership]) => {
        // cannot enrich trustedBy and addedBy, as it would create the cyclic dependency "user -> group -> user"
        const isEditor = membership.roles.includes('editor')
        obj[userId] = {
          ...membership,
          isEditor,
        }
        return obj
      }, {})
    },
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.current) return
      return rootGetters['conversations/getForGroup'](state.current.id)
    },
    id: (state) => state.id,
    // for current user:
    membership: (state, getters, rootState, rootGetters) => getters.memberships[rootGetters['auth/userId']],
    roles: (state, getters) => getters.membership ? getters.value.membership.roles : [],
    features: state => state.current && state.current.features ? state.current.features : [],
    theme: state => state.current && state.current.theme,
    isEditor: (state, getters) => getters.roles.includes('editor'),
    isBikeKitchen: (state, getters) => Boolean(getters.value && getters.value.isBikeKitchen),
    isGeneralPurpose: (state, getters) => Boolean(getters.value && getters.value.isGeneralPurpose),
  },
  actions: {
    ...withMeta({
      async fetch ({ state, commit, dispatch }, groupId) {
        commit('setId', groupId)
        const group = await groups.get(groupId)

        // aborting, another group has been loaded while we waited
        if (state.id !== groupId) return

        commit('set', group)
      },

    }),

    ...withMeta({
      async select ({ dispatch, getters, rootGetters }, { groupId }) {
        if (!groupId) throw createRouteRedirect({ name: 'groupsGallery' })

        await dispatch('fetch', groupId)

        const hasError = getters['meta/status']('fetch', groupId).hasValidationErrors

        if (hasError) {
          const groupExists = Boolean(rootGetters['groups/get'](groupId))
          if (groupExists) {
            dispatch('toasts/show', {
              message: 'GROUP.NONMEMBER_REDIRECT',
              config: {
                icon: 'warning',
                color: 'negative',
              },
            }, { root: true })
          }
          throw createRouteRedirect({ name: 'groupPreview', params: { groupPreviewId: groupId } })
        }

        // dispatch('auth/maybeBackgroundSave', { currentGroup: groupId }, { root: true })
      },
    }, {
      findId: ({ groupId }) => groupId,
      setCurrentId: ({ commit }, { groupId }) => commit('setId', groupId),
      getCurrentId: ({ state }) => state.id,
    }),

    maybeUpdate ({ getters, commit }, group) {
      if (!getters.id) return

      // update group values, do not replace group
      if (group.id === getters.id) {
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
    setId (state, value) {
      state.id = value
    },
    set (state, group) {
      state.current = Object.freeze(group)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
