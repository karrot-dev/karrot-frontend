import { useInfiniteQuery, useQueryClient } from 'vue-query'

import { useSocketEvents } from '@/utils/composables'
import { indexById } from '@/utils/datastore/helpers'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

import api from './api/notifications'

export const QUERY_KEY_BASE = 'notifications'
export const queryKeyNotificationList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)

export function useNotificationsUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    [
      'notifications:notification',
      'notifications:notification_deleted',
    ],
    async () => {
      await queryClient.invalidateQueries(['notifications'])
    },
  )
}

export function useNotificationListQuery (_, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyNotificationList(),
    ({ pageParam }) => api.list({
      cursor: pageParam,
    }),
    {
      cacheTime: 0,
      staleTime: 0,
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => {
          const { notifications, activities, issues, applications } = page.results
          const activitiesById = indexById(activities)
          const issuesById = indexById(issues)
          const applicationsById = indexById(applications)
          return notifications.map(notification => {
            return {
              ...notification,
              context: {
                ...notification.context,
                activity: activitiesById[notification.context.activity],
                issue: issuesById[notification.context.issue],
                application: applicationsById[notification.context.application],
              },
            }
          })
        }),
        pageParams,
      }),
      ...queryOptions,
    },
  )

  return {
    ...query,
    notifications: flattenPaginatedData(query),
  }
}
