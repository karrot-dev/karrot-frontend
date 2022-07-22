import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useQuery, useQueryClient } from 'vue-query'

import api from './api/users'
import { useSocketEvents } from '@/utils/composables'

export const QUERY_KEY_BASE = 'users'
export const queryKeyUserListAll = () => [QUERY_KEY_BASE, 'list', 'all'].filter(Boolean)

/**
 * Handler for socket updates
 */
export function useUsersUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()

  function updateUser (userId, updatedUser) {
    queryClient.setQueryData(queryKeyUserListAll(), users => {
      const idx = users.findIndex(user => user.id === userId)
      if (idx === -1) return users
      const updatedUsers = [...users]
      if (updatedUser) {
        // Replace user with updated version
        updatedUsers.splice(idx, 1, updatedUser)
      }
      else {
        // We don't have access to user any more
        updatedUsers.splice(idx, 1)
      }
      return updatedUsers
    })
  }

  on(
    [
      'auth:user',
      'users:user',
    ],
    updatedUser => {
      updateUser(updatedUser.id, updatedUser)
    },
  )
  on(
    [
      'groups:user_joined',
      'groups:user_left',
    ],
    async ({ userId, groupId }) => {
      // Find the user again, and update...
      // TODO: check if this handles user is now 404... probably not
      updateUser(userId, await api.get(userId))
    },
  )
}

export function useStoreUsers () {
  const store = useStore()
  return {
    getUser: id => store.state.users.entries[unref(id)],
    getEnrichedUser: id => store.getters['users/get'](unref(id)),
    getUserRef: id => computed(() => store.getters['users/get'](unref(id))),
    // getUserRef: id => computed(() => store.state.users.entries[unref(id)]),
  }
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
      select (users) {
        console.log('selecting users', users)
        return users
      },
    },
  )
  return {
    ...query,
    users: query.data,
  }
}
