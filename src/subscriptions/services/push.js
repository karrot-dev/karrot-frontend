import { computed, ref, watch, reactive } from 'vue'

import { useAuthService } from '@/authuser/services'
import subscriptionsAPI from '@/subscriptions/api/subscriptions'
import { getServiceWorkerRegistration, initializeMessaging, isSupported } from '@/subscriptions/firebase'
import { defineService } from '@/utils/datastore/helpers'
import { showToast } from '@/utils/toasts'

const LOCAL_STORAGE_KEY = 'KARROT_PUSH'

export const usePushService = defineService(() => {
  const { trackPending, isPending } = createPendingTracker()
  const { isLoggedIn } = useAuthService()

  function getState () {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY)
    return item
      ? JSON.parse(item)
      : {
          intention: null, // true (please notify me), false (please don't notify me), or null (don't notify me, but maybe pester me)
          token: null,
        }
  }

  const state = reactive(getState())

  watch(state, value => {
    if (value.intention === null && value.token === null) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
    else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
    }
  })

  const isEnabled = computed(() => Boolean(state.intention))

  async function enable () {
    if (!isSupported()) return

    state.intention = true

    const { getToken } = await initializeMessaging()

    const serviceWorkerRegistration = await getServiceWorkerRegistration()
    try {
      state.token = await getToken({ serviceWorkerRegistration })
    }
    catch (err) {
      state.tokenvalue = null
      if (err.code === 'messaging/notifications-blocked' || err.code === 'messaging/permission-blocked') {
        state.intention = false
        showToast({
          message: 'USERDATA.PUSH_BLOCKED',
          config: {
            icon: 'warning',
            color: 'negative',
          },
        })
      }
      else if (err.code === 'messaging-permission-default') { // they clicked "Not Now" (at least in Firefox)
        state.intention = null
      }
      else {
        throw err
      }
    }
  }

  async function disable () {
    if (!isSupported()) return
    state.intention = false
    if (state.token) (await initializeMessaging()).deleteToken()
    state.token = null
  }

  async function setup () {
    if (!isSupported()) return

    if (state.intention === true) {
      await enable()
      const registration = await getServiceWorkerRegistration()
      await registration.update()
    }
    else if (state.intention === false) {
      await disable()
    }
  }

  // Trigger setup after logging in
  // for stuff on logout, we do in logout mutation so we can cleanup whislt still logged in
  watch(isLoggedIn, value => {
    if (value) {
      setup()
    }
  })

  // Ensure the server has the correct tokens
  watch(() => state.token, async (currentValue, previousValue) => {
    if (!isLoggedIn.value) return // we can't modify the server if we're not logged in

    const subscriptions = await subscriptionsAPI.list()

    if (previousValue) {
      const subscription = subscriptions.find(subscription => subscription.token === previousValue)
      if (subscription) await subscriptionsAPI.delete(subscription.id)
    }

    if (currentValue) {
      const subscription = subscriptions.find(subscription => subscription.token === currentValue)
      if (!subscription) await subscriptionsAPI.create({ token: currentValue, platform: 'web' })
    }
  }, { immediate: true })

  return {
    enable: trackPending(enable),
    disable: trackPending(disable),
    isEnabled,
    isPending,
    isSupported: isSupported(),
  }
})

/**
 * A utility you can wrap around async functions, which will tell you if any of them is still executing
 * e.g.
 *
 *     const { isPending, trackPending } = createPendingTracker()
 *
 *     const someAsyncFunctionTracked = trackPending(someAsyncFunction)
 *     await someAsyncFunctionTracked()
 *
 * elsewhere you can use isPending to know if the function or any others you tracked are still running
 */
function createPendingTracker () {
  const pendingCount = ref(0)

  const isPending = computed(() => pendingCount.value > 0)

  function trackPending (fn) {
    return async function () {
      pendingCount.value++
      try {
        return await fn.apply(this, arguments)
      }
      finally {
        pendingCount.value--
      }
    }
  }
  return {
    trackPending,
    isPending,
  }
}
