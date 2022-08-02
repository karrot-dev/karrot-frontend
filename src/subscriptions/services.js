import { ref, reactive, computed } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { getServiceWorkerRegistration, initializeMessaging, isSupported } from '@/subscriptions/firebase'
import { showToast } from '@/utils/toasts'

function createPendingCounter () {
  const pendingCount = ref(0)

  const pending = computed(() => pendingCount.value > 0)

  function wrapAsync (fn) {
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
    wrapAsync,
    pending,
  }
}

export const usePushService = defineService(() => {
  const { wrapAsync, pending } = createPendingCounter()
  const state = reactive({
    intention: null,
    token: null,
  })

  const enabled = computed(() => Boolean(state.intention))

  async function enable () {
    if (!isSupported()) return

    state.intention = true

    const { getToken } = await initializeMessaging()

    const serviceWorkerRegistration = await getServiceWorkerRegistration()
    try {
      state.token = await getToken({ serviceWorkerRegistration })
    }
    catch (err) {
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

  return {
    enable: wrapAsync(enable),
    disable: wrapAsync(disable),
    setup: wrapAsync(setup),
    enabled,
    pending,
  }
})
