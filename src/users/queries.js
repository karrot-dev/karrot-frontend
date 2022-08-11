import { computed, unref } from 'vue'
import { useQuery, useQueryClient } from 'vue-query'

import api from './api/users'
import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

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
        queryClient.invalidateQueries(queryKeyUserListAll())
      }
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
    // TODO: update this with websockets too...
    queryKeyUserProfile(userId),
    () => {
      try {
        return api.getProfile(unref(userId))
      }
      catch (error) {
        return api.getInfo(unref(userId))
        // TODO: implement this bit? if the profile isn't there? or is that for somewhere else? where?
        //     const data = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
        //     throw createRouteError(data)
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
