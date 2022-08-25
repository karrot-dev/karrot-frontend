import { useQuery } from 'vue-query'

import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

import api from './api/groupsInfo'

export const QUERY_KEY_BASE = 'groupInfo'
export const queryKeyGroupInfoListAll = () => [QUERY_KEY_BASE, 'list']

export function useGroupInfoUpdater () {
  const { on } = useSocketEvents()
  const { updateOrInvalidateListEntry } = useQueryHelpers()
  on('groups:group_preview', group => {
    updateOrInvalidateListEntry(queryKeyGroupInfoListAll(), group)
  })
}

export function useGroupInfoListQuery () {
  const query = useQuery(
    queryKeyGroupInfoListAll(),
    () => api.list(),
    {
      staleTime: Infinity,
      placeholderData: () => [],
    },
  )
  return {
    ...query,
    groups: query.data,
  }
}
