import {
  reactive,
  toRefs,
  unref,
  watch,
} from '@vue/composition-api'
import deepEqual from 'deep-equal'
import { createStatus, withStatus } from '@/activities/data/actionStatus'
import { onCacheMounted } from '@/activities/data/useCached'

export function useFetcher (params, { fetcher, onInvalidate }) {
  const status = reactive(createStatus())

  // run the fetcher when params change

  // hmm, I think this kind of watcher will be re-run if the param values are the same... maybe it's ok, but not pefect!
  // OR does it do special handling when given an object to check each value? well, I guess it should only re-run when the watchers
  // are triggers anyway...
  watch(() => toPlainObject(params), (value, oldValue, watchOnInvalidate) => {
    let valid = true
    withStatus(status, () => fetcher(value, { isValid: () => valid }))
    watchOnInvalidate(() => {
      valid = false
      Object.assign(status, createStatus())
      onInvalidate()
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
  const STALE_MS = 30 * 1000
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

  return {
    // getters
    status: toRefs(status),
  }
}

// only one level...
// params is expected to be an object of either plain values, or refs, such that unref() works on them
export function toPlainObject (params) {
  const obj = {}
  for (const key of Object.keys(params)) {
    obj[key] = unref(params[key])
  }
  return obj
}
