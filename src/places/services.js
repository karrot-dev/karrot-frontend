import { computed, unref, watch } from 'vue'

import { createStylesheet } from '@/activities/stylesheet'
import { useAuthService } from '@/authuser/services'
import { usePlaceListQuery, usePlaceStatusListQuery, usePlaceTypeListQuery } from '@/places/queries'
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

export const usePlaceTypeService = defineService(() => {
  const { isLoggedIn } = useAuthService()

  // queries
  const { placeTypes } = usePlaceTypeListQuery({ enabled: isLoggedIn })

  // computed
  const placeTypesById = computed(() => indexById(placeTypes.value))

  // methods
  function getPlaceTypeById (id) {
    return placeTypesById.value[id]
  }

  function getPlaceTypesByGroup (groupId, filters = {}) {
    const entries = placeTypes.value.filter(entry => entry.group === unref(groupId))
    return filters.status ? entries.filter(entry => entry.status === unref(filters.status)) : entries
  }

  return {
    placeTypes,
    getPlaceTypeById,
    getPlaceTypesByGroup,
  }
})

export const usePlaceStatusService = defineService(() => {
  const { isLoggedIn } = useAuthService()

  // queries
  const { placeStatuses } = usePlaceStatusListQuery({ enabled: isLoggedIn })

  // computed
  const placeStatusesById = computed(() => indexById(placeStatuses.value))

  // utils
  const { updateEntries } = createStylesheet('place-status-')
  watch(placeStatuses, updateEntries, { immediate: true })

  // methods
  function getPlaceStatusById (id) {
    return placeStatusesById.value[id]
  }

  function getPlaceStatusesByGroup (groupId, filters = {}) {
    const entries = placeStatuses.value.filter(entry => entry.group === unref(groupId))
    return filters.status ? entries.filter(entry => entry.status === unref(filters.status)) : entries
  }

  return {
    placeStatuses,
    getPlaceStatusById,
    getPlaceStatusesByGroup,
  }
})
