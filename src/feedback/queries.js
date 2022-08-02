import { computed, unref } from 'vue'
import { useInfiniteQuery, useQuery } from 'vue-query'

import api from './api/feedback'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'feedback'
export const queryKeyFeedbackList = ({ groupId, placeId }) => [QUERY_KEY_BASE, { groupId, placeId }]
export const queryKeyFeedbackItem = (feedbackId) => [QUERY_KEY_BASE, feedbackId].filter(Boolean)

export function useFeedbackListQuery ({ groupId, placeId }) {
  const query = useInfiniteQuery(
    queryKeyFeedbackList({ groupId, placeId }),
    () => api.list({
      group: unref(groupId),
      place: unref(placeId),
    }),
    {
      enabled: computed(() => Boolean(unref(groupId) || unref(placeId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => {
          const { feedback, activities } = page.results
          return feedback.map(feedbackItem => {
            return {
              ...feedbackItem,
              aboutId: feedbackItem.about,
              // TODO: could implement an updater service that can update the activities via websocket... but prob not needed as they don't change much at this point
              about: activities.find(activity => activity.id === feedbackItem.about),
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
