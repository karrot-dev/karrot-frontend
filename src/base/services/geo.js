import { computed, ref } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { useCurrentGroupService } from '@/group/services'

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
