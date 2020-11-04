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

const injectionKey = Symbol('GlobalActivities')

export function provideGlobalActivities (activities) {
  provide(injectionKey, activities)
}

export function useGlobalActivities () {
  return inject(injectionKey)
}

// Hmmm I wonder if passing in is a good idea, what if theyare different...
export function useCachedActivities (cacheKey, { groupId }) {
  return useCached(
    cacheKey,
    () => useActivities({ groupId }),
  )
}

let _nextId = 0

export function useActivities ({ groupId }) {
  const _id = _nextId++

  console.log('creating useActivities', _id, 'cache?', usingCache())

  permitCachedUsage()

  const { collection: activities, update, hasId, status } = useCollection({ groupId }, fetcher)

  async function fetcher ({ groupId }, { update, reset, isValid }) {
    console.log('running fetcher!', unref(groupId))
    if (unref(groupId)) {
      const [{ results }, { results: feedbackPossibleResults }] = await Promise.all([
        api.activities.listByGroupId(unref(groupId)),
        api.activities.listFeedbackPossible(unref(groupId)),
      ])
      if (isValid()) {
        update([...results, ...feedbackPossibleResults])
      }
    }
    else {
      reset()
    }
  }

  watchEffect(() => {
    console.log('inside use activities with participants are', _id, 'length is', unref(activities).filter(activity => activity.participants.length > 0).length)
  })

  // websocket updates

  const { on } = useEvents()

  on('activities:activity', activity => {
    // another version had this check if we already have it in the store, but actually now we'll just
    // take it so long as the group matches...
    // if (activity.group === unref(groupId)) { // aaaah it doesn't have the group :(
    //   console.log('... incoming is updating')
    //   update([activity])
    // }
    console.log('use activities', _id, 'received socket update', activity)
    if (hasId(activity.id)) {
      console.log('   use activities', _id, 'from socket update!', activity)
      // TODO: this cannot get _new_ activities only existing ones... but only because the activity doesn't include the group id...
      update([activity])
    }
  })

  return {
    activities,
    status,
  }
}
