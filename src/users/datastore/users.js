import Vue from 'vue'
import users from '@/users/api/users'
import authUser from '@/authuser/api/authUser'
import auth from '@/authuser/api/auth'
import { createRouteError, createMetaModule, withMeta, metaStatuses, indexById } from '@/utils/datastore/helpers'
import router from '@/base/router'

function initialState () {
  return {
    entries: {}, // fully-visible users (fellow group members)
    infoEntries: {}, // barely-visible users (e.g. group members for applicants)
    activeUserProfileId: null,
    activeUserProfile: null,
    resendVerificationCodeSuccess: false,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => userId => {
      const user = state.entries[userId] || state.infoEntries[userId]
      if (!user) {
        return {
          id: userId,
          isCurrentUser: false,
          displayName: '?',
        }
      }
      return getters.enrich(user)
    },
    enrich: (state, getters, rootState, rootGetters) => user => {
      const authUserId = rootGetters['auth/userId']
      const membership = rootGetters['currentGroup/memberships'][user.id]

      return {
        ...user,
        isCurrentUser: user.id === authUserId,
        displayName: user.displayName === '' ? '?' : user.displayName,
        membership,
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return [
        ...Object.values(state.entries),
        ...Object.values(state.infoEntries).filter(u => !state.entries[u.id]),
      ].map(getters.enrich)
    },
    byCurrentGroup: (state, getters, rootState, rootGetters) => {
      return getters.all.filter(u => u.membership)
    },
    activeUser: (state, getters, rootState, rootGetters) => {
      if (!state.activeUserProfile) return

      const user = state.activeUserProfile
      const groups = user.groups && user.groups
        .map(rootGetters['groups/get'])
        .filter(v => !!v)
        .sort((a, b) => a.name.localeCompare(b.name))

      return {
        ...getters.enrich(user),
        groups,
      }
    },
    activeUserId: state => state.activeUserProfile && state.activeUserProfile.id,
    ...metaStatuses(['signup', 'requestResetPassword', 'resetPassword', 'resendVerificationCode', 'requestDeleteAccount', 'fetch']),
    resendVerificationCodeSuccess: state => state.resendVerificationCodeSuccess,
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }) {
        commit('update', await users.list())
      },
      async maybeFetchInfo ({ state, commit }, userIds) {
        // deduplicate list and remove loaded users
        const idsToFetch = [...new Set(userIds)].filter(id => !state.entries[id] && !state.infoEntries[id])

        if (idsToFetch.length < 1) return
        // ignore users we can't access
        const loadUserInfo = id => users.getInfo(id).catch(() => false)
        const data = await Promise.all(idsToFetch.map(loadUserInfo))
        const validData = data.filter(u => u !== false)

        if (validData.length < 1) return
        commit('updateInfo', validData)
      },

      async signup ({ dispatch }, { userData }) {
        await authUser.create(userData)

        await dispatch('auth/login', { email: userData.email, password: userData.password }, { root: true })
      },
      async requestResetPassword ({ commit }, email) {
        await auth.requestResetPassword(email)
        router.push({ name: 'requestPasswordResetSuccess' }).catch(() => {})
      },
      async resetPassword ({ dispatch }, data) {
        await auth.resetPassword(data)
        router.push({ name: 'login' }).catch(() => {})
        dispatch('toasts/show', {
          message: 'PASSWORD.RESET.SUCCESS',
        }, { root: true })
      },
      async resendVerificationCode ({ commit }) {
        await auth.resendVerificationCode()
        commit('resendVerificationCodeSuccess', true)
      },
      async requestDeleteAccount ({ dispatch }) {
        await users.requestDeleteAccount()
        dispatch('toasts/show', {
          message: 'USERDATA.REQUEST_DELETE_ACCOUNT.SUCCESS',
        }, { root: true })
        dispatch('auth/logout', {}, { root: true })
      },
    }, {
      findId: () => undefined,
    }),

    ...withMeta({
      async selectUser ({ commit }, { userId }) {
        try {
          commit('setProfile', await users.getProfile(userId))
        }
        catch (error) {
          try {
            commit('setProfile', await users.getInfo(userId))
          }
          catch (error) {
            const data = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
            throw createRouteError(data)
          }
        }
      },
    }, {
      findId: ({ userId }) => userId,
      setCurrentId: ({ commit }, { userId }) => commit('setProfileId', userId),
      getCurrentId: ({ state }) => state.activeUserProfileId,
    }),

    clearSelectedUser ({ commit }) {
      commit('setProfile', null)
    },
    clearSignup ({ dispatch }) {
      dispatch('meta/clear', ['signup'])
    },
    clearResendVerificationCode ({ commit, dispatch }) {
      dispatch('meta/clear', ['resendVerificationCode'])
      commit('resendVerificationCodeSuccess', false)
    },
    clearRequestResetPassword ({ dispatch }) {
      dispatch('meta/clear', ['requestResetPassword'])
    },
    clearResetPassword ({ commit, dispatch }) {
      dispatch('meta/clear', ['resetPassword'])
    },
    async refresh ({ state, dispatch, commit }, { userId } = {}) {
      if (userId) {
        const user = await users.get(userId)
        commit('update', [user])
      }
      else {
        dispatch('fetch')
      }
      if (state.activeUserProfile) {
        dispatch('refreshProfile', state.activeUserProfile)
      }
    },
    async refreshProfile ({ getters, commit }, user) {
      if (!user || !getters.activeUserId || user.id !== getters.activeUserId) return

      // TODO catch error if profile is info-only
      commit('setProfile', await users.getProfile(getters.activeUserId))
    },
  },
  mutations: {
    setProfile (state, userProfile) {
      state.activeUserProfile = Object.freeze(userProfile)
    },
    setProfileId (state, id) {
      state.activeUserProfileId = id
    },
    update (state, users) {
      state.entries = Object.freeze({ ...state.entries, ...indexById(users) })
    },
    updateInfo (state, users) {
      state.infoEntries = Object.freeze({ ...state.infoEntries, ...indexById(users) })
    },
    resendVerificationCodeSuccess (state, status) {
      Vue.set(state, 'resendVerificationCodeSuccess', status)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export const plugin = datastore => {
  // Keep dependent data for user profile updated, even when switching groups
  // the watch fires too often, so we better to keep track what we last loaded to avoid concurrent requests
  let lastLoadedGroupId = null
  datastore.watch((state, getters) => ({
    groupId: getters['auth/currentGroupId'],
    profileUser: getters['users/activeUser'],
  }), ({ groupId, profileUser }) => {
    if (profileUser && groupId && lastLoadedGroupId !== groupId) {
      lastLoadedGroupId = groupId
      datastore.dispatch('currentGroup/selectFromCurrentUser')
      datastore.dispatch('history/fetch', { userId: profileUser.id, groupId })
      datastore.dispatch('issues/fetchOngoingByGroupId', { groupId })
    }
    if (!profileUser) {
      lastLoadedGroupId = null
    }
  })

  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('users/clear')
    }
  })
}
