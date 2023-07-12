import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { computed, unref } from 'vue'

import { indexById } from '@/utils/datastore/helpers'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

import api from './api/feedback'

export const QUERY_KEY_BASE = 'feedback'
export const queryKeyFeedbackList = ({ groupId, placeId }) => [QUERY_KEY_BASE, { groupId, placeId }]
export const queryKeyFeedbackItem = (feedbackId) => [QUERY_KEY_BASE, feedbackId].filter(Boolean)

export function useFeedbackListQuery ({ groupId, placeId }) {
  const query = useInfiniteQuery(
    queryKeyFeedbackList({ groupId, placeId }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      place: unref(placeId),
      cursor: pageParam,
    }),
    {
      enabled: computed(() => Boolean(unref(groupId) || unref(placeId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => {
          const { feedback, activities } = page.results
          const activitiesById = indexById(activities)
          return feedback.map(feedbackItem => {
            return {
              ...feedbackItem,
              // TODO: could implement an updater service that can update the activities via websocket... but prob not needed as they don't change much at this point
              about: activitiesById[feedbackItem.about],
            }
          })
        }),
        pageParams,
      }),
    },
  )
  return {
    ...query,
    feedbackList: flattenPaginatedData(query),
  }
}

export function useFeedbackItemQuery ({ feedbackId }) {
  const query = useQuery(
    queryKeyFeedbackItem(feedbackId),
    () => api.get(unref(feedbackId)),
    {
      enabled: computed(() => !!feedbackId.value),
    },
  )
  return {
    ...query,
    feedbackItem: query.data,
  }
}
