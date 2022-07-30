import { useQuery, useQueryClient } from 'vue-query'

import api from './api/status'
import { useSocketEvents } from '@/utils/composables'
import deepmerge from 'deepmerge'

export const queryKeyStatus = () => ['status']

export function useStatusUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on('status', updatedStatus => {
    queryClient.setQueryData(queryKeyStatus(), status => deepmerge(status, updatedStatus))
  })
}

export function useStatusQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyStatus(),
    () => api.fetch(),
    {
      staleTime: Infinity,
      placeholderData: () => ({
        unseenConversationCount: 0,
        unseenThreadCount: 0,
        hasUnreadConversationsOrThreads: false,
        unseenNotificationCount: 0,
        /*
      {
        <id> : {
          pendingApplicationCount: 0,
          feedbackPossibleCount: 0,
          unreadWallMessageCount: 0
        }
      }
    */
        groups: {},
        /*
          {
            <id> {
              unreadWallMessageCount: 0
            }
          }
        */
        places: {},
      }),
      ...queryOptions,
    },
  )
  return {
    ...query,
    status: query.data,
  }
}
