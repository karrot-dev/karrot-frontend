import { computed, unref, watch } from 'vue'
import { useStore } from 'vuex'

import { defineService, indexById } from '@/utils/datastore/helpers'
import { usePlaceListQuery } from '@/places/queries'
import { useAuthService } from '@/authuser/services'
import { useIntegerRouteParam } from '@/utils/composables'

export const usePlaceService = defineService(() => {
  // services
  const { isLoggedIn } = useAuthService()

  // queries
  const { places, isLoading } = usePlaceListQuery({
    enabled: isLoggedIn,
  })

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
  const store = useStore()
  const { getPlaceById } = usePlaceService()
  const placeId = useIntegerRouteParam('placeId')

  // effects
  watch(placeId, () => {
    if (placeId.value) {
      store.dispatch('conversations/fetchForPlace', { placeId: placeId.value })
    }
  }, { immediate: true })

  // computed
  const place = computed(() => getPlaceById(placeId.value))
  const conversation = computed(() => store.getters['conversations/getForPlace'](placeId.value))

  return {
    place,
    conversation,
    placeId,
  }
})
