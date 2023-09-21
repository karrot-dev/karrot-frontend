import { computed, ref, toRef, watch, reactive } from 'vue'

import { useAuthService } from '@/authuser/services'
import { getServiceWorkerRegistration, initializeMessaging, isSupported } from '@/subscriptions/firebase'
import { useTokenService } from '@/subscriptions/services/token'
import { defineService } from '@/utils/datastore/helpers'
import { showToast } from '@/utils/toasts'

const LOCAL_STORAGE_KEY = 'KARROT_PUSH_INTENTION'

function getIntention () {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (item) {
    try {
      return JSON.parse(item).value
    }
    catch (error) {}
  }
  return null
}

function setIntention (value) {
  if (value === null) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
  else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ value }))
  }
}

export const usePushService = defineService(() => {
  const { trackPending, isPending } = createPendingTracker()
  const { isLoggedIn } = useAuthService()
  const { syncToken } = useTokenService()

  const state = reactive({
    // true (please notify me), false (please don't notify me), or null (don't notify me, but maybe pester me)
    intention: getIntention(),
    token: null,
  })

  watch(() => state.intention, value => {
    setIntention(value)
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
      state.token = null
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
    await deleteToken()
    state.token = null
  }

  async function deleteToken () {
    if (!isSupported()) return
    if (state.token) (await initializeMessaging()).deleteToken()
  }

  async function initialize () {
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
  // for stuff on logout, we do in logout mutation so we can cleanup whilst still logged in
  watch(isLoggedIn, value => {
    if (value) {
      initialize()
    }
  }, { immediate: true })

  // This keeps token synced on the server
  syncToken(toRef(state, 'token'), { platform: 'web' })

  return {
    enable: trackPending(enable),
    disable: trackPending(disable),
    isEnabled,
    isPending,
    isSupported: isSupported(),
    deleteToken,
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
