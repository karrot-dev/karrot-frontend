import { unref, computed } from 'vue'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'

import { extractCursor, flattenPaginatedData, useQueryHelpers } from '@/utils/queryHelpers'
import { useSocketEvents } from '@/utils/composables'
import api from './api/activities'
import activityTypeAPI from './api/activityTypes'
import activitySeriesAPI from './api/activitySeries'
import { useAuthService } from '@/authuser/services'

export const QUERY_KEY_BASE = 'activities'
export const queryKeyActivityList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyActivityItem = activityId => [QUERY_KEY_BASE, 'item', activityId].filter(Boolean)
export const queryKeyActivityTypeListAll = () => [QUERY_KEY_BASE, 'types']
export const queryKeyActivitySeriesList = placeId => [QUERY_KEY_BASE, 'series', 'list', placeId].filter(Boolean)
export const queryKeyActivityIcsToken = () => [QUERY_KEY_BASE, 'ics-token']

export function useActivitiesUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  const { maybeUpdateDataWith } = useQueryHelpers()

  on(
    // TODO: when we save an activity series, we get a storm of these back... and it's then refetching a lot of things!
    'activities:activity',
    updatedActivity => {
      // Update immediately
      queryClient.setQueriesData(
        queryKeyActivityList(),
        maybeUpdateDataWith(updatedActivity),
      )

      // ... but even if we managed to update the value, the filters might be such that it doesn't belong in a list any more
      // TODO: could we check some more nuanced parameters to avoid invalidation?... group? place? activityType? things that don't change
      queryClient.invalidateQueries(queryKeyActivityList())

      queryClient.setQueryData(
        queryKeyActivityItem(updatedActivity.id),
        maybeUpdateDataWith(updatedActivity),
      )
    },
  )

  on(
    'activities:activity_deleted',
    activity => {
      queryClient.invalidateQueries(queryKeyActivityList())
      queryClient.setQueryData(queryKeyActivityItem(activity.id), undefined)
    },
  )
}

export function useActivitySeriesUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    [
      'activities:series',
      'activities:series_deleted',
    ],
    async () => {
      // TODO: consider doing more refined updates
      await queryClient.invalidateQueries(queryKeyActivitySeriesList())
    },
  )
}

export function useActivityTypeUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    [
      'activities:type',
      'activities:type_deleted',
    ],
    () => {
      // TODO: could do more refined updates... but yeah...
      queryClient.invalidateQueries(queryKeyActivityTypeListAll())
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
      enabled: computed(() => Boolean(unref(groupId)) || Boolean(unref(placeId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
      ...queryOptions,
    },
  )

  return {
    ...query,
    activities: flattenPaginatedData(query),
  }
}

export function useActivityItemQuery ({ activityId }, queryOptions = {}) {
  const query = useQuery(
    queryKeyActivityItem(activityId),
    () => api.get(unref(activityId)),
    {
      enabled: computed(() => Boolean(unref(activityId))),
      ...queryOptions,
    },
  )
  return {
    ...query,
    activity: query.data,
  }
}

export function useActivitySeriesListQuery ({ placeId }) {
  const query = useQuery(
    queryKeyActivitySeriesList(placeId),
    () => activitySeriesAPI.listByPlaceId(unref(placeId)),
  )
  return {
    ...query,
    activitySeries: query.data,
  }
}

export function useActivityTypeListQuery () {
  const { isLoggedIn } = useAuthService()
  const query = useQuery(
    queryKeyActivityTypeListAll(),
    () => activityTypeAPI.list(),
    {
      placeholderData: () => [],
      staleTime: Infinity,
      enabled: isLoggedIn,
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
