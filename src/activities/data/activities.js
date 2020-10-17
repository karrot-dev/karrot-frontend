/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { computed, reactive, toRefs, watchEffect } from '@vue/composition-api'
import activities from '@/activities/api/activities'
import { indexById } from '@/utils/datastore/helpers'

const defaultState = () => ({
  entries: {},
})

// state

const state = reactive(defaultState())

// getters

export const activityIds = computed(() => Object.keys(state.entries))
export const statusView = computed(() => status)

// actions

export function fetchListByGroupId (groupId) {
  return actionStatus(async () => {
    update((await activities.listByGroupId(groupId)).results)
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

// dependent watching stuff

watchEffect(() => {
  console.log('ids are', activityIds.value)
})

watchEffect(() => {
  console.log('status!', JSON.stringify(statusView.value, null, 2))
})

// stuff that would be libary functions

function defineActions (fns) {
  const actions = {}
  for (const name of Object.keys(fns)) {
    const fn = fns[name]
    actions[name] = function () {
      const res = reactive({
        pending: true,
        error: null,
      })

      fn.apply(arguments).then(() => {
        res.pending = false
      }).catch(err => {
        res.error = err
        res.pending = false
      })

      return res
    }
  }
  return actions
}

function act (fn) {
  return () => {
    const res = reactive({
      pending: true,
      error: null,
    })

    fn.apply(arguments).then(() => {
      res.pending = false
    }).catch(err => {
      res.error = err
      res.pending = false
    })

    return res
  }
}

function actionStatus (fn) {
  const res = reactive({
    pending: true,
    error: null,
  })

  fn.apply(arguments).then(() => {
    res.pending = false
  }).catch(err => {
    res.error = err
    res.pending = false
  })

  return toRefs(res)
}

function on (topic, fn) {
  // .dummy
}
