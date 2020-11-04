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
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { indexById } from '@/utils/datastore/helpers'
import { createStatus, withStatus } from '@/activities/data/action-status'
import { onCacheExpired, onCacheMounted, permitCachedUsage } from '@/activities/data/useCached'

export function useCollection (params, fetcher) {
  permitCachedUsage()

  // state

  const entries = ref({})
  const status = reactive(createStatus())

  // getters

  const collection = computed(() => Object.keys(entries.value).map(id => entries.value[id]))

  // helpers

  function hasId (id) {
    return Boolean(entries.value[id])
  }

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

  // onCacheExpired(() => {
  //   console.log('collection cache expired!')
  //   reset()
  // })

  function checkValid (fn) {
    const initialValue = fn()
    const isValid = () => deepEqual(initialValue, fn())
    isValid.value = initialValue
    return isValid
  }

  // actions

  // just a play/example really...
  const STALE_SECONDS = 9999999 // disable for now
  function refreshIfStale () {
    if (status.finishedAt && status.finishedAt && !status.pending) {
      if (differenceInSeconds(new Date(), status.finishedAt) > STALE_SECONDS) {
        console.log(`data is more than ${STALE_SECONDS} seconds old! refreshing`)
        const isValid = checkValid(() => toPlainObject(params))
        fetcher(isValid.value, { isValid }).catch(error => {
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
