/* eslint-disable no-unused-vars */
import { computed, inject, provide, reactive, shallowReadonly, watch, watchEffect } from '@vue/composition-api'
import activitiesAPI from '@/activities/api/activities'
import { indexById } from '@/utils/datastore/helpers'
import { withStatus, createActionStatus } from '@/activities/data/action-status'

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

export function useActivities ({ groupId }) {
  const defaultState = () => ({
    entries: {},
  })

  // state

  const state = reactive(defaultState())
  const status = reactive(createActionStatus())

  // getters

  const activityIds = computed(() => Object.keys(state.entries).map(id => parseInt(id)))
  const activities = computed(() => activityIds.value.map(id => state.entries[id]))

  watch(() => groupId.value, (value, oldValue, onInvalidate) => {
    console.log('WE groupid is', value)
    if (value) {
      withStatus(status, async () => {
        console.log('requesting!', value)
        const { results, next } = await api.activities.listByGroupId(value)
        update(results)
      })
    }
    onInvalidate(() => {
      console.log('on invalidate! .. reset! val was', value)
      reset()
    })
  }, { immediate: true })

  // websocket updates

  on('activity:update', activity => {
    if (state[activity.id]) {
      // etc... whatever logic
    }
  })

  // utilities

  function update (activities) {
    state.entries = Object.freeze({ ...state.entries, ...indexById(activities) })
    console.log('updated entries', state.entries)
  }

  function reset () {
    Object.assign(state, defaultState())
  }

  return {
    // getters
    activityIds,
    activities,
    status: shallowReadonly(status),

    // utilities
    reset,
  }
}

// stuff that would be libary functions

function on (topic, fn) {
  // .dummy
}
