import authUser from '@/authuser/api/authUser'
import push from '@/subscriptions/datastore/auth/push'
import { createMetaModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'
import { objectDiff } from '@/utils/utils'

function initialState () {
  return {
    user: null,
    maybeLoggedOut: false,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule(), push },
  state: initialState(),
  getters: {
    isLoggedIn: state => !!state.user,
    user: state => state.user,
    userId: state => state.user && state.user.id,
    currentGroupId: state => state.user && state.user.currentGroup,
    ...metaStatuses(['save']),
  },
  actions: {
    ...withMeta({
      async save ({ dispatch }, data) {
        await dispatch('backgroundSave', data)
        dispatch('toasts/show', {
          message: 'NOTIFICATIONS.CHANGES_SAVED',
          config: {
            timeout: 2000,
            icon: 'thumb_up',
          },
        }, { root: true })
      },
    }, {
      // ignore ID to have simple saveStatus
      findId: () => undefined,
    }),

    maybeBackgroundSave ({ dispatch, state }, data) {
      const diff = objectDiff(state.user, { ...state.user, ...data })
      if (Object.keys(diff).length === 0) return
      return dispatch('backgroundSave', diff)
    },

    async backgroundSave ({ commit, dispatch }, data) {
      const savedUser = await authUser.save(data)
      commit('setUser', savedUser)
      commit('users/update', [savedUser], { root: true })
      return savedUser
    },

    async refresh ({ commit, dispatch, getters }) {
      // TODO: how to deal with this bit?
      // const wasLoggedIn = getters.isLoggedIn
      // let user = null
      // try {
      //   user = await authUser.get()
      // }
      // catch (error) {}
      // commit('setUser', user)
      // commit('setMaybeLoggedOut', false)
      //
      // if (!user && wasLoggedIn && !getters.logoutStatus.pending) {
      //   dispatch('logout')
      // }
    },

    clearSettingsStatus ({ commit, dispatch }) {
      dispatch('meta/clear', ['save'])
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = Object.freeze(user)
    },

    setMaybeLoggedOut (state, value) {
      if (state.user) {
        state.maybeLoggedOut = value
      }
      else {
        state.maybeLoggedOut = false
      }
    },
  },
}

export function plugin (datastore) {
  datastore.watch(state => state.auth.maybeLoggedOut, async (maybeLoggedOut) => {
    if (maybeLoggedOut) {
      await datastore.dispatch('auth/refresh')
    }
  })
}
