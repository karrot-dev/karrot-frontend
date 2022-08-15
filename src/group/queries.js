import { computed, unref } from 'vue'
import { useQuery, useQueryClient } from 'vue-query'
import api from './api/groups'
import { useSocketEvents } from '@/utils/composables'

export const QUERY_KEY_BASE = 'groups'
export const queryKeyGroupDetail = groupId => [QUERY_KEY_BASE, 'detail', groupId].filter(Boolean)

export function useGroupDetailUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on('groups:group_detail', group => {
    queryClient.setQueryData(queryKeyGroupDetail(group.id), value => value !== undefined ? group : undefined)
  })
}

export function useGroupDetailQuery ({ groupId }) {
  const query = useQuery(
    queryKeyGroupDetail(groupId),
    () => api.get(unref(groupId)),
    {
      enabled: computed(() => Boolean(unref(groupId))),
      staleTime: Infinity,
    },
  )
  return {
    ...query,
    group: query.data,
  }
}
