import { useGlobalCurrentGroup } from '@/activities/data/useCurrentGroup'
import { useGlobalAuthUser } from '@/activities/data/useAuthUser'
import { useGlobalUsers } from '@/activities/data/useUsers'

export function useGlobal () {
  const currentGroup = useGlobalCurrentGroup()
  const authUser = useGlobalAuthUser()
  const users = useGlobalUsers()
  // also pull out some commonly used ones
  // also pull out some common ones...
  const { getUser } = users
  const { currentGroupId } = currentGroup
  const { authUserId } = authUser
  return {
    currentGroup,
    authUser,
    users,

    // common ones
    getUser,
    currentGroupId,
    authUserId,
  }
}
