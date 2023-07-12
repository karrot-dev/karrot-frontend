import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, unref } from 'vue'

import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers, useWait } from '@/utils/queryHelpers'

import api from './api/groups'

export const QUERY_KEY_BASE = 'groups'
export const queryKeyGroupDetail = groupId => [QUERY_KEY_BASE, 'detail', groupId].filter(Boolean)
export const queryKeyTimezones = () => [QUERY_KEY_BASE, 'timezones']

export function useGroupDetailUpdater () {
  const queryClient = useQueryClient()
  const { maybeUpdateDataWith } = useQueryHelpers()
  const { on } = useSocketEvents()
  on('groups:group_detail', updatedGroup => {
    queryClient.setQueryData(
      queryKeyGroupDetail(updatedGroup.id),
      maybeUpdateDataWith(updatedGroup),
    )
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
