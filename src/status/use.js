import { computed } from 'vue'

import { useStatusService } from '@/status/services'

export function useGroupStatus (groupId) {
  const { status } = useStatusService()
  return computed(() => status.value?.groups[groupId.value] || {})
}
