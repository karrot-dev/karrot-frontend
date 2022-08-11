import { computed, unref } from 'vue'
import { useQuery } from 'vue-query'
import api from './api/groups'

export const QUERY_KEY_BASE = 'groups'
export const queryKeyGroupDetail = groupId => [QUERY_KEY_BASE, 'detail', groupId].filter(Boolean)

export function useGroupDetailQuery ({ groupId }) {
  const query = useQuery(
    queryKeyGroupDetail(groupId),
    () => api.get(unref(groupId)),
    {
      enabled: computed(() => Boolean(unref(groupId))),
      // staleTime: Infinity, // TODO: implement updating before using this
    },
  )
  return {
    ...query,
    group: query.data,
  }
}
