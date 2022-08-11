import groups from '@/group/api/groups'
import {
  createMetaModule,
  createRouteRedirect,
  withMeta,
  withPrefixedIdMeta,
} from '@/utils/datastore/helpers'
import { extend } from 'quasar'
import i18n from '@/base/i18n'
import { messages as loadMessages } from '@/locales/index'

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
        activeAgreement: getters.activeAgreement,
        awaitingAgreement: !!(getters.activeAgreement && getters.activeAgreement.agreed === false),
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
    agreement: (state, getters, rootState, rootGetters) => state.current && rootGetters['agreements/get'](state.current.activeAgreement),
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
    getNotificationTypeStatus: (state, getters) => notificationType => getters['meta/status']('changeNotificationType', notificationType),
  },
  actions: {
    ...withMeta({
      async fetch ({ state, commit, dispatch }, groupId) {
        commit('setId', groupId)
        const group = await groups.get(groupId)

        // aborting, another group has been loaded while we waited
        if (state.id !== groupId) return

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
        if (getters.id) await groups.throttledMarkUserActive(getters.id)
      },

    }),

    ...withMeta({
      async changeNotificationType ({ dispatch, getters }, { notificationType, enabled }) {
        if (enabled) {
          await groups.addNotificationType(getters.id, notificationType)
        }
        else {
          await groups.removeNotificationType(getters.id, notificationType)
        }
        dispatch('toasts/show', {
          message: 'NOTIFICATIONS.CHANGES_SAVED',
          config: {
            timeout: 2000,
            icon: 'thumb_up',
          },
        }, { root: true })
      },
    }, {
      findId: ({ notificationType }) => notificationType,
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

export function plugin (datastore) {
  // clear group when logged out
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('currentGroup/clear')
      datastore.commit('currentGroup/meta/clear')
    }
  })
  datastore.watch(
    (state, getters) => [getters['currentGroup/isBikeKitchen'], getters['currentGroup/isGeneralPurpose'], getters['i18n/locale']],
    async ([isBikeKitchen, isGeneralPurpose, locale] = []) => {
      if (!locale) return
      if (isBikeKitchen || isGeneralPurpose) {
        const generalPurposeMessages = await import('@/locales/generalPurpose.json')
        const messages = await loadMessages(locale)
        if (!(datastore.getters['currentGroup/isBikeKitchen'] || datastore.getters['currentGroup/isGeneralPurpose'])) return
        const mergedMessages = extend(true, {}, messages, generalPurposeMessages)
        i18n.setLocaleMessage(locale, mergedMessages)
      }
      else {
        const messages = await loadMessages(locale)
        if (datastore.getters['currentGroup/isBikeKitchen'] || datastore.getters['currentGroup/isGeneralPurpose']) return

        i18n.setLocaleMessage(locale, messages)
      }
    },
    { immediate: true },
  )
}
