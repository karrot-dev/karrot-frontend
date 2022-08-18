import { readonly, ref, watch } from 'vue'

import { defineService, isValidationError } from '@/utils/datastore/helpers'
import { useCurrentGroupService } from '@/group/services'
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

export const useRouteErrorService = defineService(() => {
  const hasError = ref(false)
  const message = ref(null)

  const router = useRouter()
  router.beforeEach(() => {
    hasError.value = false
    message.value = null
  })

  function setRouteError (messageValue = null) {
    console.log('setting route error!', messageValue)
    hasError.value = true
    message.value = messageValue
  }

  return {
    setRouteError,
    hasError: readonly(hasError),
    message: readonly(message),
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
