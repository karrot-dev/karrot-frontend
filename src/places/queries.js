import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useQueries, useQuery, useQueryClient } from 'vue-query'

import api from './api/places'

export function useStorePlaces () {
  const store = useStore()
  return {
    getPlace: id => store.state.places.entries[unref(id)],
    getEnrichedPlace: id => store.getters['places/get'](unref(id)),
    // TODO: remove or use
    getPlaceRef: id => computed(() => store.state.places.entries[unref(id)]),
  }
}

// TODO: remove or use
export function usePlaceListQuery () {
  const query = useQuery(
    ['places', 'list'],
    () => api.list(),
  )
  return {
    ...query,
    places: query.data,
  }
}

// TODO: remove or use
export function usePlaceQueries ({ placeIds }) {
  const queryClient = useQueryClient()
  return useQueries({
    queries: computed(() => {
      return placeIds.value.map(id => {
        return {
          queryKey: ['places', 'detail', id],
          queryFn: () => {
            const existingList = queryClient.getQueryData(['places', 'list'])
            console.log('existing', existingList)
            if (existingList) {
              const item = existingList.find(item => item.id === unref(id))
              if (item) {
                console.log('found item!', item)
                return item
              }
            }
            return api.get(unref(id))
          },
        }
      })
    }),
  })
}

// TODO: remove or use
export function usePlaceDetailQuery ({ id }) {
  const query = useQuery(
    ['places', 'detail', id],
    () => api.get(unref(id)),
    {
      enabled: computed(() => !!unref(id)),
    },
  )
  return {
    ...query,
    place: query.data,
  }
}
