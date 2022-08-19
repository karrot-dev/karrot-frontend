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
      // TODO: could set 10 minutes or something, just to periodically check, or on background refresh? as might not have got websockets?
      staleTime: Infinity, // rely on websockets to keep updated
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
  // try {
  //   commit('setProfile', await users.getProfile(userId))
  // }
  // catch (error) {
  //   try {
  //     commit('setProfile', await users.getInfo(userId))
  //   }
  //   catch (error) {
  //     const data = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
  //     throw createRouteError(data)
  //   }
  // }
}
