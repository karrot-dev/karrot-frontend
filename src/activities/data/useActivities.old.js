/* eslint-disable no-unused-vars */
import { computed, inject, markRaw, provide, reactive, ref, toRefs, unref, watch } from '@vue/composition-api'
import deepEqual from 'deep-equal'
import activitiesAPI from '@/activities/api/activities'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { indexById } from '@/utils/datastore/helpers'
import { createStatus, withStatus } from '@/activities/data/action-status'
import { useEvents } from '@/activities/data/useEvents'
import { onCacheExpired, onCacheMounted, permitCachedUsage, useCached } from '@/activities/data/useCached'

const api = {
  activities: activitiesAPI,
}

// const injectionKey = Symbol('GlobalActivities')
//
// export function provideGlobalActivities (activities) {
//   provide(injectionKey, activities)
// }
//
// export function useGlobalActivities () {
//   return inject(injectionKey)
// }

// Hmmm I wonder if passing in is a good idea, what if theyare different...
export function useCachedActivities (cacheKey, options) {
  return useCached(
    cacheKey,
    () => useActivities(options),
  )
}

export function useActivities ({
                                 // a value or a ref specifying the group id
                                 groupId,
                               }) {
  permitCachedUsage()

  // state

  const entries = ref({})
  const status = reactive(createStatus())

  // getters

  const activities = computed(() => Object.keys(unref(entries)).map(id => unref(entries)[id]))

  // fetching

  // just an API concept
  // status and data would be reactive, maybe data is a ref to whatever is returned?
  // the first argument is passed into a watch function... and also then as params
  // const { status, data } = useFetcher(() => ({
  //   groupId: unref(groupId)
  // }), async ({ groupId }) => {
  //   return await api.activities.listByGroupId(unref(groupId))
  // })
  // const activities2 = computed(() => Object.keys(unref(data).results).map(id => unref(data).results[id]))

  watch(() => unref(groupId), (value, oldValue, onInvalidate) => {
    console.log('running group id watcher', oldValue, typeof oldValue, '-> ', value, typeof value)
    if (value) {
      withStatus(status, fetcher)
    }
    else {
      console.log('reset as value is', value)
      reset()
    }
    // AHHH if we're using this in a cached thing, then it'll get called on the first unmount... so we can't use it :/
    /*
      onInvalidate(() => {
        // I guess this is for ensure stuff for the previous group is cleared, could actually do that specifically...?
        // nah this is only for one group here
        console.log('onInvalidate groupid watcher!', value, typeof value, 'current value is', unref(groupId), typeof unref(groupId))
        reset()
      })
      */
  }, { immediate: true })

  async function fetcher () {
    const valid = checkValid(() => unref(groupId))
    const [{ results }, { results: feedbackPossibleResults }] = await Promise.all([
      api.activities.listByGroupId(unref(groupId)),
      api.activities.listFeedbackPossible(unref(groupId)),
    ])
    // const { results, next } = await api.activities.listByGroupId(unref(groupId))
    if (valid()) {
      update([...results, ...feedbackPossibleResults])
    }
  }

  onCacheMounted(() => {
    refreshIfStale()
  })

  onCacheExpired(() => {
    console.log('activities cache expired!')
    reset()
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
    console.log('socket update!', activity)
    if (unref(entries)[activity.id]) {
      // TODO: this cannot get _new_ activities only existing ones... but only because the activity doesn't include the group id...
      update([activity])
    }
  })

  function checkValid (fn) {
    const initialValue = fn()
    return () => deepEqual(initialValue, fn())
  }

  // actions

  // just a play/example really...
  const STALE_SECONDS = 10
  function refreshIfStale () {
    if (status.finishedAt && status.finishedAt && !status.pending) {
      if (differenceInSeconds(new Date(), status.finishedAt) > STALE_SECONDS) {
        console.log(`data is more than ${STALE_SECONDS} seconds old! refreshing`)
        fetcher().catch(error => {
          // don't do much with errors, it's only background stuff...
          console.log('error with background refresh', error)
        })
      }
    }
  }

  // utilities

  function update (activities) {
    entries.value = { ...unref(entries), ...indexById(activities.map(markRaw)) }
  }

  function reset () {
    console.log('resetting activities')
    entries.value = {}
    Object.assign(status, createStatus())
  }

  return {
    // getters

    activities,
    status: toRefs(status),

    // actions
    refreshIfStale,
  }
}
