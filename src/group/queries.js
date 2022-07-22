import { computed, unref } from 'vue'
import { useQuery } from 'vue-query'
import api from './api/groups'

export const QUERY_KEY_BASE = 'groups'
export const queryKeyGroupDetail = id => [QUERY_KEY_BASE, 'detail', id].filter(Boolean)

export function useGroupDetailQuery ({ id }) {
  const query = useQuery(
    queryKeyGroupDetail(id),
    () => api.get(unref(id)),
    {
      enabled: computed(() => !!unref(id)),
      // staleTime: Infinity, // TODO: implement updating before using this
    },
  )
  return {
    ...query,
    group: query.data,
  }
}
