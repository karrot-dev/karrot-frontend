import { useQuery } from 'vue-query'

import api from './api/groupsInfo'

export const QUERY_KEY_BASE = 'groupInfo'
export const queryKeyGroupInfoListAll = () => [QUERY_KEY_BASE, 'list']

export function useGroupInfoListQuery () {
  const query = useQuery(
    queryKeyGroupInfoListAll(),
    () => api.list(),
    {
      staleTime: Infinity, // TODO: implement socket updates!
    },
  )
  return {
    ...query,
    groups: query.data,
  }
}
