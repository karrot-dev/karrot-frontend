import { Platform } from 'quasar'
import { computed, ref, watch, reactive } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useConfigQuery } from '@/base/queries'
import api from '@/subscriptions/api/subscriptions'
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
  const { config, wait: waitForConfig } = useConfigQuery()

  const vapidPublicKey = computed(() => config.value?.webPush?.vapidPublicKey)

  function isSupported () {
    return Boolean(
      navigator.serviceWorker &&
      ('PushManager' in window) &&
      location.protocol === 'https:',
    )
  }

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

  async function saveSubscription (subscription) {
    const { endpoint, keys } = subscription.toJSON()

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

    try {
      await api.subscribe(toSave)
    }
    catch (err) {
      // If we can't save it to the server important to remove it right away
      // As we assume all subscriptions in the client are on the server
      await subscription.unsubscribe()
    }
  }

  async function subscribe () {
    if (!isSupported()) return

    const serviceWorkerRegistration = await getServiceWorkerRegistration()

    await waitForConfig() // not sure if we need it, but heyho
    if (!vapidPublicKey.value) return

    const subscription = await getExistingSubscription()

    if (subscription) {
      return subscription
    }
    try {
      const options = {
        applicationServerKey: urlB64ToUint8Array(vapidPublicKey.value),
        userVisibleOnly: true,
      }
      const newSubscription = await serviceWorkerRegistration.pushManager.subscribe(options)
      await saveSubscription(newSubscription)
    }
    catch (err) {
      state.intention = null
    }
  }

  async function unsubscribe () {
    if (!isSupported()) return

    const subscription = await getExistingSubscription()
    if (subscription) {
      const { endpoint, keys } = subscription.toJSON()
      await subscription.unsubscribe()
      await api.unsubscribe({ endpoint, keys })
    }
  }

  async function disable () {
    if (!isSupported()) return
    state.intention = false
    await unsubscribe()
    state.token = null
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

  return {
    enable: trackPending(enable),
    disable: trackPending(disable),
    unsubscribe,
    isEnabled,
    isPending,
    isSupported: isSupported(),
  }
})

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
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

async function getServiceWorkerRegistration () {
  // See also https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready
  //
  // It returns a Promise that will never reject, and which waits indefinitely until the
  // ServiceWorkerRegistration associated with the current page has an active worker
  return await navigator.serviceWorker.ready
}
