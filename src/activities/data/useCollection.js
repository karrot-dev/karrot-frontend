/* eslint-disable */
import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import {
  computed,
  markRaw,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
} from '@vue/composition-api'
import deepEqual from 'deep-equal'
import { indexById } from '@/utils/datastore/helpers'
import { createStatus, withStatus } from '@/activities/data/action-status'
import { onCacheMounted } from '@/activities/data/useCached'

export function useCollection (params, fetcher) {
  // state

  const entries = ref({})
  const status = reactive(createStatus())

  // getters

  const collection = computed(() => Object.keys(entries.value).map(id => entries.value[id]))

  // helpers

  function hasId (id) {
    return Boolean(entries.value[id])
  }

  // only one level...
  function toPlainObject (params) {
    const obj = {}
    for (const key of Object.keys(params)) {
      obj[key] = unref(params[key])
    }
    return obj
  }

  // run the fetcher when params change

  watch(() => toPlainObject(params), (value, oldValue, onInvalidate) => {
    let valid = true
    withStatus(status, () => fetcher(value, { isValid: () => valid }))
    onInvalidate(() => {
      valid = false
      reset()
    })
  }, { immediate: true })

  onCacheMounted(() => {
    refreshIfStale()
  })

  function checkValid (fn) {
    const initialValue = fn()
    const isValid = () => deepEqual(initialValue, fn())
    isValid.value = initialValue
    return isValid
  }

  // actions

  // just a play/example really...
  const STALE_MS = 10 * 1000
  function refreshIfStale () {
    if (status.finishedAt && !status.pending) {
      const now = new Date().getTime()
      const age = now - status.finishedAt
      if (age > STALE_MS) {
        console.log(`data is more than ${STALE_MS}ms (${age}ms) old! refreshing`)
        const isValid = checkValid(() => toPlainObject(params))
        fetcher(isValid.value, { isValid }).then(() => {
          status.finishedAt = new Date().getTime()
        }).catch(error => {
          // don't do much with errors, it's only background stuff...
          console.log('error with background refresh', error)
        })
      }
    }
  }

  // utilities

  function update (items) {
    entries.value = { ...unref(entries), ...indexById(items.map(markRaw)) }
  }

  function reset () {
    console.log('resetting collection')
    entries.value = {}
    Object.assign(status, createStatus())

  }

  return {
    // getters
    collection,
    status: toRefs(status),

    // helpers
    hasId,

    // actions
    update,
  }
}
