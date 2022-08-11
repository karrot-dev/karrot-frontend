import { useAuthService } from '@/authuser/services'
import { useApplicationListQuery } from '@/applications/queries'

export function useApplicationHelpers () {
  const { userId } = useAuthService()
  const { applications } = useApplicationListQuery({ userId, status: 'pending' })

  function getHasMyApplicationPending (groupId) {
    if (!groupId) return false
    return applications.value.find(application => application.group === groupId)
  }

  return {
    getHasMyApplicationPending,
  }
}
