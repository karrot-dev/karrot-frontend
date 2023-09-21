import { useQuery } from '@tanstack/vue-query'

import configAPI from '@/base/api/config'
import { useWait } from '@/utils/queryHelpers'

export const queryKeyConfig = () => ['config']

export function useConfigQuery () {
  const query = useQuery(
    queryKeyConfig(),
    () => configAPI.fetch(),
    {
      // doesn't change much, needing a reload to get new config is OK
      staleTime: Infinity,
    },
  )
  return {
    ...query,
    wait: useWait(query),
    config: query.data,
  }
}
