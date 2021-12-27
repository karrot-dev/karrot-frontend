import subscriptionsAPI from '@/subscriptions/api/subscriptions'
import { createMetaModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'
import { initializeMessaging, getServiceWorkerRegistration, isSupported } from '@/subscriptions/firebase'

function initialState () {
  return {
    // These are persisted in the browser (see persistedState.js)
    // This is because push notifications are related to the device you are on
    intention: null, // true (please notify me), false (please don't notify me), or null (don't notify me, but maybe pester me)
    token: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    enabled: state => Boolean(state.intention),
    pending: (state, getters) => {
      return [
        getters.enableStatus,
        getters.disableStatus,
        getters.askStatus,
      ].some(status => status.pending)
    },
    ...metaStatuses(['enable', 'disable', 'ask']),
  },
  actions: {
    ...withMeta({
      async enable ({ commit, dispatch }) {
        if (!isSupported()) return

        commit('setIntention', true)

        const { getToken } = await initializeMessaging()

        const serviceWorkerRegistration = await getServiceWorkerRegistration()
        let token
        try {
          token = await getToken({ serviceWorkerRegistration })
        }
        catch (err) {
          if (err.code === 'messaging/notifications-blocked' || err.code === 'messaging/permission-blocked') {
            commit('setIntention', false)
            dispatch('toasts/show', {
              message: 'USERDATA.PUSH_BLOCKED',
              config: {
                icon: 'warning',
                color: 'negative',
              },
            }, { root: true })
          }

          else if (err.code === 'messaging-permission-default') { // they clicked "Not Now" (at least in Firefox)
            commit('setIntention', null)
          }
          else {
            throw err
          }
          return
        }

        commit('setToken', token)
      },

      async disable ({ state, commit }) {
        if (!isSupported()) return

        commit('setIntention', false)

        if (state.token) (await initializeMessaging()).deleteToken()

        commit('setToken', null)
      },
    }),

    async setup ({ state, dispatch }) {
      if (!isSupported()) return

      if (state.intention === true) {
        await dispatch('enable')
        const registration = await getServiceWorkerRegistration()
        await registration.update()
      }
      else if (state.intention === false) {
        await dispatch('disable')
      }
    },

  },
  mutations: {
    setIntention (state, value) {
      state.intention = value
    },
    setToken (state, token) {
      state.token = token
    },
  },
}

export const plugin = datastore => {
  // Trigger setup after logging in
  // (logout handling is in auth/logout action)
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) datastore.dispatch('auth/push/setup')
  })

  // Ensure the server has the correct tokens
  datastore.watch((state) => state.auth.push.token, async (token, previousToken) => {
    if (!datastore.getters['auth/isLoggedIn']) return // we can't modify the server if we're not logged in

    const subscriptions = await subscriptionsAPI.list()

    if (previousToken) {
      const subscription = subscriptions.find(subscription => subscription.token === previousToken)
      if (subscription) await subscriptionsAPI.delete(subscription.id)
    }

    if (token) {
      const subscription = subscriptions.find(subscription => subscription.token === token)
      if (!subscription) await subscriptionsAPI.create({ token, platform: 'web' })
    }
  }, { immediate: true })
}
