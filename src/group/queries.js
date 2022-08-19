import { computed, unref } from 'vue'
import { useQuery, useQueryClient } from 'vue-query'

import { useSocketEvents } from '@/utils/composables'
import { useWait } from '@/utils/queryHelpers'

import api from './api/groups'

export const QUERY_KEY_BASE = 'groups'
export const queryKeyGroupDetail = groupId => [QUERY_KEY_BASE, 'detail', groupId].filter(Boolean)
export const queryKeyTimezones = () => [QUERY_KEY_BASE, 'timezones']

export function useGroupDetailUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on('groups:group_detail', group => {
    queryClient.setQueryData(queryKeyGroupDetail(group.id), value => value !== undefined ? group : undefined)
  })
}

export function useGroupDetailQuery ({ groupId }, queryOptions = {}) {
  const query = useQuery(
    queryKeyGroupDetail(groupId),
    () => api.get(unref(groupId)), // TODO: this can call api.get(null) :/
    {
      enabled: computed(() => Boolean(unref(groupId))),
      staleTime: Infinity,
      ...queryOptions,
    },
  )
  return {
    ...query,
    wait: useWait(query),
    group: query.data,
  }
}

export function useTimezonesQuery () {
  const query = useQuery(
    queryKeyTimezones(),
    () => api.timezones(),
    {
      placeholderData: () => ({ allTimezones: [] }),
      staleTime: Infinity, // they don't change much...
      select: data => data.allTimezones,
    },
  )
  return {
    ...query,
    timezones: query.data,
  }
}
