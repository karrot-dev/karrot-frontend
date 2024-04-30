import { computed, unref } from 'vue'

import { useApplicationListQuery } from '@/applications/queries'
import { useAuthService } from '@/authuser/services'

export function useMyApplicationPending (groupId) {
  const { userId } = useAuthService()
  const { applications } = useApplicationListQuery({ userId, status: 'pending' }, { keepPreviousData: true })
  return computed(() => {
    return Boolean(applications.value.find(application => application.group === unref(groupId)))
  })
}

export class useApplicationHelpers {
}
