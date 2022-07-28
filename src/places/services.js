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

  function getPlacesByGroup (groupId) {
    console.log('getting places!', places.value)
    return places.value.filter(place => place.group === unref(groupId))
  }

  return {
    places,
    getPlaceById,
    getPlacesByGroup,
  }
})
