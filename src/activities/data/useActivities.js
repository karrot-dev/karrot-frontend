/* eslint-disable no-unused-vars */
import {
  computed,
  inject,
  markRaw,
  provide,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
  watchEffect,
} from '@vue/composition-api'
import deepEqual from 'deep-equal'
import activitiesAPI from '@/activities/api/activities'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { indexById } from '@/utils/datastore/helpers'
import { createStatus, withStatus } from '@/activities/data/action-status'
import { useEvents } from '@/activities/data/useEvents'
import { onCacheExpired, onCacheMounted, permitCachedUsage, useCached, usingCache } from '@/activities/data/useCached'
import { useCollection } from '@/activities/data/useCollection'

const api = {
  activities: activitiesAPI,
}

export function useActivities ({ groupId }) {
  permitCachedUsage()

  const { collection: activities, update, hasId, status } = useCollection({ groupId }, fetcher)

  async function fetcher ({ groupId }, { isValid }) {
    if (groupId) {
      const [{ results }, { results: feedbackPossibleResults }] = await Promise.all([
        api.activities.listByGroupId(groupId),
        api.activities.listFeedbackPossible(groupId),
      ])
      if (isValid()) {
        update([...results, ...feedbackPossibleResults])
      }
    }
  }

  // websocket updates

  const { on } = useEvents()

  on('activities:activity', activity => {
    if (hasId(activity.id)) {
      // TODO: this cannot get _new_ activities only existing ones... but only because the activity doesn't include the group id...
      update([activity])
    }
  })

  return {
    activities,
    status,
  }
}
