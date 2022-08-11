import { readonly, ref, computed } from 'vue'

import { DEFAULT_LOCALE, detectLocale } from '@/base/datastore/i18n'
import { defineService } from '@/utils/datastore/helpers'
import { useCurrentGroupService } from '@/group/services'
import { useStore } from 'vuex'

// TODO: this isn't a reactive ref or anything, does it work?
let pwaInstallPrompt = null
export function setPwaInstallPrompt (value) {
  pwaInstallPrompt = value
}
export function getPwaInstallPrompt () {
  return pwaInstallPrompt
}

const DEFAULT_LOCATION = { lat: '49.8990022441358', lng: '8.66415739059448' }

// TODO: this isn't a reactive ref or anything, does it work?
let geoipCoordinates = null
export function setGeoipCoordinates (value) {
  geoipCoordinates = value
}

export const useGeoService = defineService(() => {
  // services
  const { group } = useCurrentGroupService()

  // computed
  const myCoordinates = computed(() => geoipCoordinates)
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

export const useI18nService = defineService(() => {
  const locale = ref(detectLocale() || DEFAULT_LOCALE)

  function setLocale (value) {
    // maybe do background save if it's changed for the user...
    locale.value = value
  }

  return {
    locale: readonly(locale),
    setLocale,
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
