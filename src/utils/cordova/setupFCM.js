import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useTokenService } from '@/subscriptions/services/token'

export function useCordovaFCM () {
  const router = useRouter()
  const { syncToken } = useTokenService()
  const token = ref(null)

  syncToken(token, { platform: 'android' })

  const devicereadyTimeout = setTimeout(() => {
    console.error('deviceready not fired within 5 seconds, is cordova.js loaded? FCM will not work otherwise.')
  }, 5000)

  // The deviceready event behaves somewhat differently from others.
  // Any event handler registered after the deviceready event fires has its callback function called immediately.
  // https://cordova.apache.org/docs/en/11.x/cordova/events/events.html#deviceready
  document.addEventListener('deviceready', () => {
    clearTimeout(devicereadyTimeout)
    initialize()
  }, false)

  async function initialize () {
    const { FCM } = window
    if (FCM) {
      token.value = await FCM.getToken()
      FCM.onTokenRefresh(value => {
        token.value = value
      })
      FCM.onNotification(receiveNotification)
    }
    else {
      console.error('window.FCM is not available, push notifications will not work')
    }
  }

  function receiveNotification (data) {
    if (!data.wasTapped) return
    // Notification was received on device tray and tapped by the user
    const path = data.karrot_route
    if (path) {
      // TODO: do I need to implement this bit again?
      // (we don't do so much now whilst routes are pending, so maybe not needed?)
      // const pendingRoute = datastore.state.routeMeta.next
      // if (pendingRoute && pendingRoute.path === path) return
      router.push(path)
    }
  }
}
