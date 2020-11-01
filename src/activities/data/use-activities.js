/* eslint-disable no-unused-vars */
import {
  computed,
  inject, markRaw, onUnmounted,
  provide,
  reactive, shallowReactive,
  shallowReadonly,
  shallowRef,
  ref,
  watch,
  watchEffect,
  unref, onMounted,
} from '@vue/composition-api'
import deepEqual from 'deep-equal'
import activitiesAPI from '@/activities/api/activities'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { indexById } from '@/utils/datastore/helpers'
import { withStatus, createStatus } from '@/activities/data/action-status'
import reactiveNow from '@/utils/reactiveNow'
import { useEvents } from '@/activities/data/useEvents'

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

export function useEnrichedActivities ({ activities, authUserId, getUser, enrichUser }) {
  function enrichActivity (activity) {
    return {
      ...activity,
      isUserMember: activity.participants.includes(unref(authUserId)),
      isEmpty: activity.participants.length === 0,
      isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
      participants: activity.participants.map(getUser).map(enrichUser),
      // this causes recalculation on every reactiveNow change... maybe should computed it closer to the component?
      hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,
      // hasStarted: false,
      // TODO: these would go away...
      joinStatus: {
        pending: false,
      },
      leaveStatus: {
        pending: false,
      },
    }
  }
  return {
    enrichedActivities: computed(() => unref(activities).map(enrichActivity)),
  }
}

export function useActivities ({
  // a value or a ref specifying the group id
  groupId,
}) {
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
    let invalid = false
    if (value) {
      withStatus(status, async () => {
        const { results, next } = await api.activities.listByGroupId(unref(groupId))
        if (!invalid) {
          update(results)
        }
      })
    }
    onInvalidate(() => {
      invalid = true
      reset()
    })
  }, { immediate: true })

  onUnmounted(() => {
    reset()
  })

  // websocket updates

  const { on } = useEvents()

  on('activities:activity', activity => {
    if (unref(entries)[activity.id]) {
      update([activity])
    }
  })

  function checkValid (fn) {
    const initialValue = fn()
    return () => deepEqual(initialValue, fn())
  }

  // actions

  // just a play/example really...
  async function refreshIfStale () {
    if (status.finishedAt && status.finishedAt) {
      if (differenceInSeconds(new Date(), status.finishedAt) > 5) {
        console.log('data is more than 5 seconds old! refreshing')
        // TODO: woudl need an invalidation method here too
        const valid = checkValid(() => unref(groupId))
        const { results, next } = await api.activities.listByGroupId(unref(groupId))
        if (valid()) {
          update(results)
          status.finishedAt = new Date()
        }
      }
    }
  }

  // utilities

  function update (activities) {
    entries.value = { ...unref(entries), ...indexById(activities.map(markRaw)) }
  }

  function reset () {
    entries.value = {}
    Object.assign(status, createStatus())
  }

  return {
    // getters

    activities,
    status: shallowReadonly(status),

    // actions
    refreshIfStale,

    // utilities

    reset,
  }
}
