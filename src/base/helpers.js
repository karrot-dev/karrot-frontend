import { computed } from 'vue'

import { useConfigQuery } from '@/base/queries'

export function useConfig (key) {
  const { config } = useConfigQuery()
  return computed(() => getIn(key, config.value))
}

function getIn (path, obj) {
  return path.split('.').reduce((o, key) => o?.[key], obj)
}
