import api from '@/activities/api/activities'
import { useEvents } from '@/activities/data/useEvents'
import { permitCachedUsage, useCached } from '@/activities/data/useCached'
import { useCollection } from '@/activities/data/useCollection'
import { createStatus, withStatus } from '@/activities/data/actionStatus'
import { reactive } from '@vue/composition-api'
import { useAuthUser } from '@/activities/data/useAuthUser'
import { useCurrentGroup } from '@/activities/data/useCurrentGroup'

export function useActivities ({ groupId }) {
  permitCachedUsage()

  const { collection: activities, update, getById, status } = useCollection({ groupId }, fetcher)

  async function fetcher ({ groupId }, { isValid }) {
    if (groupId) {
      const [{ results }, { results: feedbackPossibleResults }] = await Promise.all([
        api.listByGroupId(groupId),
        api.listFeedbackPossible(groupId),
      ])
      if (isValid()) {
        update([...results, ...feedbackPossibleResults])
      }
    }
  }

  const { on } = useEvents()

  on('activities:activity', activity => {
    if (getById(activity.id)) {
      // TODO: this cannot get _new_ activities only existing ones... but only because the activity doesn't include the group id...
      update([activity])
    }
  })

  return {
    activities,
    status,
  }
}

export function useActivityActions () {
  const joinStatus = reactive(createStatus())
  const leaveStatus = reactive(createStatus())

  function join (activityId) {
    withStatus(joinStatus, () => api.join(activityId))
  }

  function leave (activityId) {
    withStatus(leaveStatus, () => api.leave(activityId))
  }
  return {
    join,
    leave,
    joinStatus,
    leaveStatus,
  }
}

export function useCachedActivities (key) {
  const { authUserId } = useAuthUser()
  const { currentGroupId } = useCurrentGroup()
  return useCached(
    key,
    () => useActivities({ groupId: currentGroupId, userId: authUserId }),
  )
}
