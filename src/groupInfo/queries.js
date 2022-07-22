import { useStore } from 'vuex'
import { unref } from 'vue'
import { useQuery } from 'vue-query'

import api from './api/groupsInfo'

export const QUERY_KEY_BASE = 'groupInfo'
export const queryKeyGroupInfoList = () => [QUERY_KEY_BASE, 'list']

export function useStoreGroups () {
  const store = useStore()
  return {
    getGroup: id => store.getters['groups/get'](unref(id)),
  }
}

export function useGroupInfoListQuery () {
  const query = useQuery(
    queryKeyGroupInfoList(),
    () => api.list(),
  )
  return {
    ...query,
    groups: query.data,
  }
}
