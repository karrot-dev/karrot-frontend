import { Platform } from 'quasar'
import { computed, ref, toRef, watch, reactive } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useConfigQuery } from '@/base/queries'
import webPush from '@/subscriptions/api/webPush'
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
  const { config, wait: waitForConfig } = useConfigQuery()

  const vapidPublicKey = computed(() => config.value?.webPush?.vapidPublicKey)

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

    if (Notification.permission === 'denied') {
      // nothing we can do!
      console.log('notifications denied')
      state.intention = false
      showToast({
        message: 'USERDATA.PUSH_BLOCKED',
        config: {
          icon: 'warning',
          color: 'negative',
        },
      })
      return
    }

    await subscribe()
  }

  async function getExistingSubscription () {
    const serviceWorkerRegistration = await getServiceWorkerRegistration()
    return await serviceWorkerRegistration.pushManager.getSubscription()
  }

  async function subscribe () {
    const serviceWorkerRegistration = await getServiceWorkerRegistration()

    await waitForConfig() // not sure if we need it, but heyho

    const subscription = await getExistingSubscription()
    if (subscription) {
      return subscription
    }
    try {
      const options = {
        applicationServerKey: urlB64ToUint8Array(vapidPublicKey.value),
        userVisibleOnly: true,
      }
      console.log('subscribing to push with', options)
      const newSubscription = await serviceWorkerRegistration.pushManager.subscribe(options)
      console.log('we got a new subscription to save!', newSubscription, newSubscription.toJSON())
      // let's just save it now, or unsubscribe immediately

      const { endpoint, keys } = newSubscription.toJSON()

      const toSave = {

        // subscription info
        endpoint,
        keys,

        // extra meta info
        mobile: Boolean(Platform.is.mobile),
        browser: Platform.is.name,
        version: Platform.is.version,
        os: Platform.is.platform,
      }

      console.log('saving', toSave)

      try {
        await webPush.subscribe(toSave)
      }
      catch (err) {
        console.log('failed to save', err)
        // get rid of it right away...
        await newSubscription.unsubscribe()
      }
    }
    catch (err) {
      console.log('failed to subscribe to push://', err)
      state.intention = null
      showToast({
        // TODO(PR): this is not the right error message
        message: 'USERDATA.PUSH_BLOCKED',
        config: {
          icon: 'warning',
          color: 'negative',
        },
      })
    }
  }

  async function unsubscribe () {
    const subscription = await getExistingSubscription()
    if (subscription) {
      console.log('unsubscribing', subscription)
      await subscription.unsubscribe()
    }
  }

  async function disable () {
    if (!isSupported()) return
    state.intention = false
    await unsubscribe()
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

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

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
