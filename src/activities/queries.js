import { unref, computed } from 'vue'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'

import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'
import { useSocketEvents } from '@/utils/composables'
import api from './api/activities'
import activityTypeAPI from './api/activityTypes'

export const QUERY_KEY_BASE = 'activities'
export const queryKeyActivityList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyActivityDetail = id => [QUERY_KEY_BASE, 'detail', id].filter(Boolean)
export const queryKeyActivityTypeList = () => [QUERY_KEY_BASE, 'types']
export const queryKeyActivityIcsToken = () => [QUERY_KEY_BASE, 'ics-token']

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
  groupId,
  dateMin,
  placeId,
  seriesId,
  activityTypeId,
  slots,
  feedbackPossible,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyActivityList({ groupId, placeId, seriesId, activityTypeId, slots, feedbackPossible, dateMin }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      place: unref(placeId),
      series: unref(seriesId),
      activity_type: unref(activityTypeId),
      slots: unref(slots),
      date_min: unref(dateMin),
      feedback_possible: unref(feedbackPossible),
      cursor: pageParam,
      page_size: 10,
    }),
    {
      staleTime: Infinity,
      ...queryOptions,
      enabled: computed(() => !!unref(groupId)),
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

export function useActivityTypeListQuery () {
  const query = useQuery(
    queryKeyActivityTypeList(),
    () => activityTypeAPI.list(),
    {
      // staleTime: Infinity, // TODO: implement ws updates, then can add this
    },
  )
  return {
    ...query,
    activityTypes: query.data,
  }
}

export function useICSTokenQuery (queryOptions) {
  const query = useQuery(
    queryKeyActivityIcsToken(),
    () => api.getICSAuthToken(),
    queryOptions,
  )
  return {
    ...query,
    token: query.data,
  }
}
