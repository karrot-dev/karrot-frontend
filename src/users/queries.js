import { useQuery, useQueryClient } from 'vue-query'

import api from './api/users'
import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'users'
export const queryKeyUserListAll = () => [QUERY_KEY_BASE, 'list', 'all'].filter(Boolean)

/**
 * Handler for socket updates
 */
export function useUsersUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  const { updateOrInvalidateListEntry } = useQueryHelpers()

  on(
    [
      'auth:user',
      'users:user',
    ],
    user => updateOrInvalidateListEntry(queryKeyUserListAll(), user),
  )
  on(
    [
      'groups:user_joined',
      'groups:user_left',
    ],
    async ({ userId, groupId }) => {
      // Find the user again, and update...
      // TODO: check if this handles user is now 404... probably not
      const user = await api.get(userId)
      if (user) {
        updateOrInvalidateListEntry(queryKeyUserListAll(), user)
      }
      else {
        // User removed I guess... TODO: make sure this makes sense!
        queryClient.invalidateQueries(queryKeyUserListAll)
      }
    },
  )
}

/**
 * Holds all users across all groups
 */
export function useUserListAllQuery () {
  const query = useQuery(
    queryKeyUserListAll(),
    () => api.list(),
    {
      // TODO: could set 10 minutes or something, just to periodically check, or on background refresh? as might not have got websockets?
      staleTime: Infinity, // rely on websockets to keep updated
    },
  )
  return {
    ...query,
    users: query.data,
  }
}
