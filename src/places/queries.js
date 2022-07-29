import { computed, unref } from 'vue'
import { useQuery, useQueryClient } from 'vue-query'

export const QUERY_KEY_BASE = 'places'
export const queryKeyPlaceListAll = () => [QUERY_KEY_BASE, 'list', 'all'].filter(Boolean)

import api from './api/places'
import { useSocketEvents } from '@/utils/composables'

/**
 * Handler for socket updates
 */
export function usePlacesUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()

  function updateEntry (updatedEntry) {
    queryClient.setQueryData(queryKeyPlaceListAll(), entries => {
      const idx = entries.findIndex(entry => entry.id === updatedEntry.id)

      // Entry not present, nothing to do
      if (idx === -1) return entries

      // Clone our existing list
      const updatedEntries = [...entries]

      // Delete old entry, and replace with updated one
      updatedEntries.splice(idx, 1, updatedEntry)

      return updatedEntries
    })
  }

  on('places:place', updateEntry)
}

export function usePlaceListQuery () {
  const query = useQuery(
    queryKeyPlaceListAll(),
    () => api.list(),
    {
      placeholderData: () => [],
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
