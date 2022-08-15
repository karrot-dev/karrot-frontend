import { ref, computed, watch } from 'vue'

import { defineService, isValidationError } from '@/utils/datastore/helpers'
import { useCurrentGroupService } from '@/group/services'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useAuthService } from '@/authuser/services'
import axios from '@/base/api/axios'

// TODO: this isn't a reactive ref or anything, does it work?
let pwaInstallPrompt = null
export function setPwaInstallPrompt (value) {
  pwaInstallPrompt = value
}
export function getPwaInstallPrompt () {
  return pwaInstallPrompt
}

const DEFAULT_LOCATION = { lat: '49.8990022441358', lng: '8.66415739059448' }

const myCoordinates = ref(null)
export function setGeoipCoordinates (value) {
  myCoordinates.value = value
}

export const useGeoService = defineService(() => {
  // services
  const { group } = useCurrentGroupService()

  // computed
  const defaultCenter = computed(() => {
    if (group.value?.latitude && group.value?.longitude) {
      return {
        lat: group.value?.latitude,
        lng: group.value?.longitude,
      }
    }
    return myCoordinates.value || DEFAULT_LOCATION
  })

  return {
    myCoordinates,
    defaultCenter,
  }
})

export const useRouteErrorService = defineService(() => {
  // just interfaces with routeError vuex store module for now
  const store = useStore()

  const routeError = computed(() => store.getters['routeError/status'])

  function setRouteError (routeError = null) {
    store.dispatch('routeError/set', routeError)
  }

  return {
    routeError,
    setRouteError,
  }
})

export const useCheckResponseAuthStatus = defineService(() => {
  const { refresh } = useAuthService()
  axios.interceptors.response.use(response => response, async error => {
    if (isValidationError(error)) {
      if (error.response.status === 403) {
        if (!error.request.responseURL.endsWith('/api/auth/user/')) {
          await refresh()
        }
      }
    }
    throw error
  })
})

export const useRoutingLogic = defineService(() => {
  const router = useRouter()
  const route = useRoute()

  const {
    isLoggedIn,
    waitForUserToLoad,
  } = useAuthService()

  const {
    groupId,
    features,
    waitForGroupToLoad,
  } = useCurrentGroupService()

  // If we find we are logged out, but on a logged in page, go to login page
  watch(isLoggedIn, value => {
    if (!value && route.matched.some(m => m.meta.requireLoggedIn)) {
      router.push({ name: 'login', query: { to: route.fullPath } })
    }
  })

  router.beforeEach(async (to, from, nextFn) => {
    let next

    await waitForUserToLoad()

    const requiredGroupFeatures = to.matched.map(m => m.meta.requireFeature).filter(Boolean)

    // redirect homescreen correctly
    // the home page is a meta page, and doesn't have any content so we have to choose a suitable page to send them to
    if (to.path === '/') {
      if (groupId.value) {
        next = { name: 'group', params: { groupId: groupId.value } }
      }
      else if (isLoggedIn.value) {
        next = { name: 'groupsGallery' }
      }
      else {
        next = { name: 'landing' }
      }
    }

    // check meta.requireLoggedIn
    else if (to.matched.some(m => m.meta.requireLoggedIn) && !isLoggedIn.value) {
      next = { name: 'login', query: { to: to.fullPath } }
    }

    // check meta.requireLoggedOut
    else if (to.matched.some(m => m.meta.requireLoggedOut) && isLoggedIn.value) {
      next = { path: '/' }
    }

    // check if we have the required features
    else if (requiredGroupFeatures.length > 0) {
      // need our group to be ready to  check the features
      await waitForGroupToLoad()

      if (requiredGroupFeatures.some(feature => !features.value.includes(feature))) {
        if (groupId.value) {
          next = { name: 'group', params: { groupId: groupId.value } }
        }
        else {
          next = { path: '/' }
        }
      }
    }

    if (next) {
      nextFn(next)
      return
    }

    nextFn()
  })
})
