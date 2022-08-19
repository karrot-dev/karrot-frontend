import { useApplicationListQuery } from '@/applications/queries'
import { useAuthService } from '@/authuser/services'

export function useApplicationHelpers () {
  const { userId } = useAuthService()
  const { applications } = useApplicationListQuery({ userId, status: 'pending' }, { keepPreviousData: true })

  function getHasMyApplicationPending (groupId) {
    if (!groupId) return false
    return Boolean(applications.value.find(application => application.group === groupId))
  }

  return {
    getHasMyApplicationPending,
  }
}
