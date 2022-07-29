import { computed, unref } from 'vue'
import { useQuery } from 'vue-query'

export const QUERY_KEY_BASE = 'places'
export const queryKeyPlaceListAll = () => [QUERY_KEY_BASE, 'list', 'all'].filter(Boolean)

import api from './api/places'
import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

/**
 * Handler for socket updates
 */
export function usePlacesUpdater () {
  const { on } = useSocketEvents()
  const { updateOrInvalidateListEntry } = useQueryHelpers()

  on('places:place', updatedEntry => {
    updateOrInvalidateListEntry(queryKeyPlaceListAll(), updatedEntry)
  })
}

export function usePlaceListQuery () {
  const query = useQuery(
    queryKeyPlaceListAll(),
    () => api.list(),
    {
      placeholderData: () => [],
      staleTime: Infinity, // rely on socket updates
    },
  )
  return {
    ...query,
    places: query.data,
  }
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
