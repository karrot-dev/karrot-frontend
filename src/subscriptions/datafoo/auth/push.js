import subscriptionsAPI from '@/subscriptions/api/subscriptions'
import { createMetaModule, withMeta, metaStatuses } from '@/utils/datafoo/helpers'
import { initializeMessaging, removeServiceWorkersOnUnload, hasServiceWorker, getServiceWorker } from '@/subscriptions/firebase'

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
      async enable ({ commit }) {
        commit('setIntention', true)

        const messaging = await initializeMessaging()

        messaging.onTokenRefresh(async () => {
          commit('setToken', await messaging.getToken())
        })

        let token = await messaging.getToken()
        if (!token) {
          try {
            await messaging.requestPermission()
          }
          catch (err) {
            if (err.code === 'messaging/notifications-blocked' || err.code === 'messaging/permission-blocked') {
              commit('setIntention', false)
            }

            else if (err.code === 'messaging-permission-default') { // they clicked "Not Now" (at least in Firefox)
              commit('setIntention', null)
            }
            else {
              throw err
            }
            return
          }
          token = await messaging.getToken()
        }
        commit('setToken', token)
        removeServiceWorkersOnUnload(false)
      },

      async disable ({ state, commit }) {
        commit('setIntention', false)

        const token = state.token

        // We assume that if there is no service worker then we don't have any firebase stuff registered
        // This is to avoid loading the big ugly firebase library if we don't really need it
        if (await hasServiceWorker()) {
          if (token) (await initializeMessaging()).deleteToken(token)
          removeServiceWorkersOnUnload(true)
        }

        commit('setToken', null)
      },
    }),

    async setup ({ state, dispatch }) {
      if (state.intention === true) {
        await dispatch('enable')
        const worker = await getServiceWorker()
        worker.update()
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

export const plugin = store => {
  // Trigger setup after logging in
  // (logout handling is in auth/logout action)
  store.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) store.dispatch('auth/push/setup')
  })

  // Ensure the server has the correct tokens
  store.watch((state) => state.auth.push.token, async (token, previousToken) => {
    if (!store.getters['auth/isLoggedIn']) return // we can't modify the server if we're not logged in

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
