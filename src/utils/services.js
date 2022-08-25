import { Platform } from 'quasar'
import { computed, readonly, ref, reactive } from 'vue'

import about from '@/utils/api/about'
import { defineService } from '@/utils/datastore/helpers'

export const useConnectivity = defineService(() => {
  const state = reactive({
    connected: true, // starting with true prevents warnings on page load
    requestReconnect: false,
    reconnecting: false,
  })

  function requestReconnect () {
    state.requestReconnect = true
    state.reconnecting = true
  }

  function resetRequestReconnect () {
    state.requestReconnect = false
  }

  function setConnected (value) {
    state.connected = value
    state.reconnecting = false
  }

  return {
    isConnected: computed(() => state.connected),
    isReconnecting: computed(() => state.reconnecting),
    isReconnectedRequested: computed(() => state.requestReconnect),
    requestReconnect,
    resetRequestReconnect,
    setConnected,
  }
})

export const useAboutService = defineService(() => {
  const deployed = ref(null)

  async function fetch () {
    deployed.value = await about.get()
  }

  // TODO: this would be better as a vue-query query, as it'll do this for us...

  // initial fetch
  fetch()

  // ... then re-fetch every so often as it won't be pushed to us
  const TEN_MINUTES = 1000 * 60 * 10
  if (!Platform.is.cordova) {
    setInterval(fetch, TEN_MINUTES)
  }

  const updateAvailable = computed(() => {
    const latestVersion = deployed.value?.commitSHA
    const builtVersion = process.env.KARROT.GIT_SHA1
    return latestVersion && builtVersion && latestVersion !== builtVersion
  })

  return {
    deployed: readonly(deployed),
    updateAvailable,
  }
})
