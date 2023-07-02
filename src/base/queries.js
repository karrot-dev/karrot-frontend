import { useQuery } from 'vue-query'

import configAPI from '@/base/api/config'

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
    config: query.data,
  }
}
