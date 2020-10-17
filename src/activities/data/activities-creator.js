/* eslint-disable no-unused-vars */
import { computed, reactive, watchEffect } from '@vue/composition-api'
import activities from '@/activities/api/activities'
import { indexById } from '@/utils/datastore/helpers'
import { actionStatus } from '@/activities/data/action-status'

export default () => {
  const defaultState = () => ({
    entries: {},
  })

  // state

  const state = reactive(defaultState())

  // getters

  const activityIds = computed(() => Object.keys(state.entries))

  // actions

  function fetchListByGroupId (groupId) {
    return actionStatus(async () => {
      const { results, next } = (await activities.listByGroupId(groupId))
      update(results)
      return {
        nextPage: 'could be a function here?',
        or: 'some value',
        like: 42,
        results,
        next,
      }
    })
  }

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

  // random dependent watching stuff

  watchEffect(() => {
    console.log('ids are', activityIds.value)
  })

  return {
    // getters
    activityIds,

    // actions
    fetchListByGroupId,

    // utilities
    reset,
  }
}

// stuff that would be libary functions

function on (topic, fn) {
  // .dummy
}
