import { useQuery } from '@tanstack/vue-query'
import { unref, computed } from 'vue'

import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

import placeStatusAPI from './api/placeStatuses'
import placeTypeAPI from './api/placeTypes'
import api from './api/places'

export const QUERY_KEY_BASE = 'places'
export const queryKeyPlaceListAll = () => [QUERY_KEY_BASE, 'list', 'all']
export const queryKeyPlaceStatistics = (placeId) => [QUERY_KEY_BASE, 'statistics', placeId].filter(Boolean)
export const queryKeyPlaceTypeListAll = () => [QUERY_KEY_BASE, 'types']
export const queryKeyPlaceStatusListAll = () => [QUERY_KEY_BASE, 'statuses']

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
      enabled: computed(() => Boolean(unref(placeId))),
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

export function usePlaceTypeListQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyPlaceTypeListAll(),
    () => placeTypeAPI.list(),
    {
      placeholderData: () => [],
      staleTime: 30 * 60 * 1000, // reload every 30 minutes as we don't have websocket updates for it yet
      ...queryOptions,
    },
  )
  return {
    ...query,
    placeTypes: query.data,
  }
}

export function usePlaceStatusListQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyPlaceStatusListAll(),
    () => placeStatusAPI.list(),
    {
      placeholderData: () => [],
      staleTime: 30 * 60 * 1000, // reload every 30 minutes as we don't have websocket updates for it yet
      ...queryOptions,
    },
  )
  return {
    ...query,
    placeStatuses: query.data,
  }
}
