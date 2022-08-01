import { useQuery } from 'vue-query'
import { unref, computed } from 'vue'

import api from './api/places'
import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'places'
export const queryKeyPlaceListAll = () => [QUERY_KEY_BASE, 'list', 'all']
export const queryKeyPlaceStatistics = (placeId) => [QUERY_KEY_BASE, 'statistics', placeId].filter(Boolean)

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

export function usePlaceStatisticsQuery ({ placeId }) {
  const query = useQuery(
    queryKeyPlaceStatistics(placeId),
    () => api.statistics(unref(placeId)),
    {
      enabled: computed(() => !!placeId.value),
    },
  )
  return {
    ...query,
    statistics: query.data,
  }
}

export function usePlaceListQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyPlaceListAll(),
    () => api.list(),
    {
      placeholderData: () => [],
      staleTime: Infinity, // rely on socket updates
      ...queryOptions,
    },
  )
  return {
    ...query,
    places: query.data,
  }
}
