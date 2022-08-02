import { unref, computed } from 'vue'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'

import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'
import { useSocketEvents } from '@/utils/composables'
import api from './api/activities'
import activityTypeAPI from './api/activityTypes'

export const QUERY_KEY_BASE = 'activities'
export const queryKeyActivityList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyActivityItem = activityId => [QUERY_KEY_BASE, 'item', activityId].filter(Boolean)
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
  places,
  feedbackPossible,
  pageSize = 10,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyActivityList({ groupId, placeId, seriesId, activityTypeId, slots, feedbackPossible, places, dateMin }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      place: unref(placeId),
      series: unref(seriesId),
      activityType: unref(activityTypeId),
      slots: unref(slots),
      places: unref(places),
      dateMin: unref(dateMin),
      feedbackPossible: unref(feedbackPossible),
      cursor: pageParam,
      pageSize,
    }),
    {
      // setting cache to 0, as otherwise it seems to lag when switching filters to one with a cached result
      // also, if there are LOADS of results cached, can be slow to re-render them all...
      // TODO: maybe explore some other solutions...
      cacheTime: 0,
      staleTime: 0,
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

export function useActivityItemQuery ({ activityId }) {
  const query = useQuery(
    queryKeyActivityItem(activityId),
    () => api.get(unref(activityId)),
    {
      enabled: computed(() => !!activityId.value),
    },
  )
  return {
    ...query,
    activity: query.data,
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
