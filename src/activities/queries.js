import { unref, computed } from 'vue'
import { useInfiniteQuery, useQueryClient } from 'vue-query'

import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'
import { useSocketEvents } from '@/utils/composables'
import api from './api/activities'

export const QUERY_KEY_BASE = 'activities'
export const queryKeyActivityList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyActivityDetail = id => [QUERY_KEY_BASE, 'detail', id].filter(Boolean)

export function useActivitiesUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    [
      'activities:activity',
      'activities:activity_deleted',
    ],
    // We could do fiddly updates to the data, but simpler to just invalidate the lot
    async () => {
      await queryClient.invalidateQueries(queryKeyActivityList())
    },
  )
}

export function useActivityListQuery ({
  group,
  dateMin,
  place,
  series,
  feedbackPossible,
}) {
  const query = useInfiniteQuery(
    queryKeyActivityList({ group, place, series, feedbackPossible, dateMin }),
    ({ pageParam }) => api.list({
      group: unref(group),
      place: unref(place),
      series: unref(series),
      date_min: unref(dateMin),
      feedback_possible: unref(feedbackPossible),
      cursor: pageParam,
      page_size: 10,
    }),
    {
      enabled: computed(() => !!unref(group)),
      staleTime: Infinity,
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
    },
  )

  return {
    ...query,
    activities: flattenPaginatedData(query),
  }
}
