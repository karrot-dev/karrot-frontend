import { computed, unref } from 'vue'
import { defineService, indexById } from '@/utils/datastore/helpers'
import { usePlaceListQuery } from '@/places/queries'

export const usePlaceService = defineService(() => {
  // queries
  const { places } = usePlaceListQuery()

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
    places,
    getPlaceById,
    getPlacesByGroup,
  }
})
