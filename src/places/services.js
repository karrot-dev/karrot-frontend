import { computed, unref } from 'vue'
import { defineService, indexById } from '@/utils/datastore/helpers'
import { usePlaceListQuery } from '@/places/queries'
import { useStore } from 'vuex'

export const usePlaceService = defineService(() => {
  // queries
  const { places, isLoading } = usePlaceListQuery()

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

  // computed
  // TODO: decouple from store
  const placeId = computed(() => store.state.places.activePlaceId)
  const place = computed(() => getPlaceById(placeId.value))

  return {
    place,
    placeId,
  }
})
