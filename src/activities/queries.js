import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/vue-query'
import { debounce } from 'quasar'
import { unref, computed, watch } from 'vue'

import { infiniteScroll } from '@/messages/queries'
import { useSocketEvents } from '@/utils/composables'
import { extractCursor, flattenPaginatedData, useQueryHelpers } from '@/utils/queryHelpers'

import api from './api/activities'
import activitySeriesAPI from './api/activitySeries'
import activityTypeAPI from './api/activityTypes'

export const QUERY_KEY_BASE = 'activities'
export const queryKeyActivityList = params => [QUERY_KEY_BASE, 'activity', 'list', params].filter(Boolean)
export const queryKeyActivityCount = params => [QUERY_KEY_BASE, 'activity', 'count', params].filter(Boolean)
export const queryKeyActivityItem = activityId => [QUERY_KEY_BASE, 'activity', 'item', activityId].filter(Boolean)
export const queryKeyPublicActivityItem = activityPublicId => [QUERY_KEY_BASE, 'public-activity', 'item', activityPublicId].filter(Boolean)
export const queryKeyActivityTypeListAll = () => [QUERY_KEY_BASE, 'types']
export const queryKeyActivitySeriesList = placeId => [QUERY_KEY_BASE, 'series', 'list', placeId].filter(Boolean)
export const queryKeyActivitySeriesItem = id => [QUERY_KEY_BASE, 'series', 'item', id].filter(Boolean)
export const queryKeyActivityIcsToken = () => [QUERY_KEY_BASE, 'ics-token']

const invalidateActivityList = debounce(queryClient => queryClient.invalidateQueries(queryKeyActivityList()), 500)

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
      invalidateActivityList(queryClient)

      queryClient.setQueryData(
        queryKeyActivityItem(updatedActivity.id),
        maybeUpdateDataWith(updatedActivity),
      )
    },
  )

  on(
    'activities:activity_deleted',
    activity => {
      invalidateActivityList(queryClient)
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
      await Promise.all([
        // we invalidate all activity things, as they might have changed...
        // (the server used to send individual activity updates after series change, but it would cause a storm of updates...)
        queryClient.invalidateQueries([QUERY_KEY_BASE, 'activity']),
        // invalidate the series list itself...
        queryClient.invalidateQueries(queryKeyActivitySeriesList()),
      ])
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
  placeStatus,
  seriesId,
  activityTypeId,
  slots,
  places,
  feedbackPossible,
  hasFeedback,
  ordering,
  pageSize = 10,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyActivityList({ groupId, placeId, placeStatus, seriesId, activityTypeId, slots, feedbackPossible, hasFeedback, places, ordering, dateMin }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      place: unref(placeId),
      placeStatus: unref(placeStatus),
      series: unref(seriesId),
      activityType: unref(activityTypeId),
      slots: unref(slots),
      places: unref(places),
      dateMin: unref(dateMin),
      feedbackPossible: unref(feedbackPossible),
      hasFeedback: unref(hasFeedback),
      ordering: unref(ordering),
      cursor: pageParam,
      pageSize,
    }),
    {
      // setting cache to 1 second, as otherwise it seems to lag when switching filters to one with a cached result
      // also, if there are LOADS of results cached, can be slow to re-render them all...
      // TODO: maybe explore some other solutions...
      cacheTime: 1000,
      staleTime: 1000,
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
    infiniteScroll: infiniteScroll(query),
  }
}

export function useActivityCountQuery ({
  groupId,
  dateMin,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyActivityCount({ groupId, dateMin }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      dateMin: unref(dateMin),
      cursor: pageParam,
      pageSize: 1200,
    }),
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      enabled: computed(() => Boolean(unref(groupId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
      ...queryOptions,
    },
  )

  watch(query.isFetching, value => {
    // load ALL activities
    if (!value && unref(query.hasNextPage)) {
      query.fetchNextPage()
    }
  })

  const activities = flattenPaginatedData(query)

  const activityCountByPlace = computed(() => unref(activities).reduce((acc, entry) => {
    if (acc[entry.place]) {
      acc[entry.place] += 1
    }
    else {
      acc[entry.place] = 1
    }
    return acc
  }, {}))

  return {
    ...query,
    activityCountByPlace,
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
    {
      enabled: computed(() => Boolean(unref(placeId))),
    },
  )
  return {
    ...query,
    activitySeries: query.data,
  }
}

export function useActivitySeriesItemQuery ({ id, enabled }) {
  const query = useQuery(
    queryKeyActivitySeriesItem(id),
    () => activitySeriesAPI.get(unref(id)),
    {
      enabled: computed(() => Boolean(unref(id)) && unref(enabled)),
    },
  )
  return {
    ...query,
    activitySeries: query.data,
  }
}

export function useActivityTypeListQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyActivityTypeListAll(),
    () => activityTypeAPI.list(),
    {
      placeholderData: () => [],
      staleTime: Infinity,
      ...queryOptions,
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

export function usePublicActivityListQuery ({
  groupId,
  dateMin,
  pageSize = 10,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyActivityList({ groupId, dateMin }),
    ({ pageParam }) => api.listPublic({
      group: unref(groupId),
      dateMin: unref(dateMin),
      cursor: pageParam,
      pageSize,
    }),
    {
      enabled: computed(() => Boolean(unref(groupId))),
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
    infiniteScroll: infiniteScroll(query),
    publicActivities: flattenPaginatedData(query),
  }
}

export function usePublicActivityItemQuery ({ activityPublicId }, queryOptions = {}) {
  const query = useQuery(
    queryKeyPublicActivityItem(activityPublicId),
    () => api.getByPublicId(unref(activityPublicId)),
    {
      enabled: computed(() => Boolean(unref(activityPublicId))),
      ...queryOptions,
    },
  )
  return {
    ...query,
    publicActivity: query.data,
  }
}
