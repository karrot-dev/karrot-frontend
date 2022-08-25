import { computed, unref } from 'vue'

import { useAuthService } from '@/authuser/services'
import { usePlaceListQuery } from '@/places/queries'
import { useIntegerRouteParam } from '@/utils/composables'
import { defineService, indexById } from '@/utils/datastore/helpers'

export const usePlaceService = defineService(() => {
  const { isLoggedIn } = useAuthService()

  // queries
  const { places, isLoading } = usePlaceListQuery({ enabled: isLoggedIn })

  // computed
  const placesById = computed(() => indexById(places.value))

  // methods
  function getPlaceById (id) {
    return placesById.value[id]
  }

  function getPlacesByGroup (groupId, filters = {}) {
    const entries = places.value.filter(place => place.group === unref(groupId))
    return filters.status ? entries.filter(entry => entry.status === unref(filters.status)) : entries
  }

  return {
    isLoading,
    places,
    getPlaceById,
    getPlacesByGroup,
  }
})

export const useActivePlaceService = defineService(() => {
  // services
  const { getPlaceById } = usePlaceService()

  const placeId = useIntegerRouteParam('placeId')

  // computed
  const place = computed(() => getPlaceById(placeId.value))

  return {
    place,
    placeId,
  }
})
