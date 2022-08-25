import { computed, unref } from 'vue'
import { useQuery, useQueryClient } from 'vue-query'

import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

import api from './api/users'

export const QUERY_KEY_BASE = 'users'
export const queryKeyUserListAll = () => [QUERY_KEY_BASE, 'list', 'all'].filter(Boolean)
export const queryKeyUserProfile = userId => [QUERY_KEY_BASE, 'profile', userId].filter(Boolean)

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
    user => {
      queryClient.invalidateQueries(queryKeyUserProfile(user.id))
      updateOrInvalidateListEntry(queryKeyUserListAll(), user)
    },
  )
  on(
    [
      'groups:user_joined',
      'groups:user_left',
    ],
    async ({ userId }) => {
      queryClient.invalidateQueries(queryKeyUserProfile(userId))
      queryClient.invalidateQueries(queryKeyUserListAll())
    },
  )
}

/**
 * Holds all users across all groups
 */
export function useUserListAllQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyUserListAll(),
    () => api.list(),
    {
      staleTime: 15 * 60 * 1000, // rely on websockets to keep updated, but refresh after 15 minutes
      placeholderData: () => [],
      ...queryOptions,
    },
  )
  return {
    ...query,
    users: query.data,
  }
}

export function useUserProfileQuery ({ userId }) {
  const query = useQuery(
    queryKeyUserProfile(userId),
    () => {
      try {
        return api.getProfile(unref(userId))
      }
      catch (error) {
        return api.getInfo(unref(userId))
      }
    },
    {
      enabled: computed(() => Boolean(unref(userId))),
    },
  )
  return {
    ...query,
    user: query.data,
  }
}
