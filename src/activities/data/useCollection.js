/* eslint-disable */
// eslint-disable-next-line no-unused-vars
import {
  computed,
  getCurrentInstance,
  isReactive,
  // eslint-disable-next-line no-unused-vars
  markRaw, onUnmounted,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
  watchEffect,
} from '@vue/composition-api'
import deepEqual from 'deep-equal'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { indexById } from '@/utils/datastore/helpers'
import { createStatus, withStatus } from '@/activities/data/action-status'
import { onCacheExpired, onCacheMounted, permitCachedUsage } from '@/activities/data/useCached'

const cache = {
  entries: {},
  status: {},
  updatedAt: null,
}

export function useCollection (dependencies, fetcher) {
  // permitCachedUsage()

  // state

  const entries = ref({})
  const status = reactive(createStatus())

  // if (window.__entries) throw new Error('already have __entries!')
  // window.__entries = entries
  //
  // const vm = getCurrentInstance()
  //
  // console.log('root is', vm.$root)
  //
  // console.log('current instance is', vm)
  // vm.$on('hook:destroyed', () => {
  //   console.log('aha hook:destroyed!')
  // })

  // window.__ci = () => {
  //   console.log('current instance?', vm === getCurrentInstance())
  // }

  // getters

  const collection = computed(() => Object.keys(entries.value).map(id => entries.value[id]))
  // const collection2 = computed(() => Object.keys(state.entries).map(id => state.entries[id]))

  // if (window.__collection) throw new Error('already have __collection')
  // window.__collection = collection

  // const id = 13246
  //
  // watchEffect(() => {
  //   const entry = entries.value[id]
  //   console.log('watched entry', id, entry && entry.participants)
  // })

  // window.__getfromcollection = () => collection.value.find(entry => entry.id === id)
  // window.__getfromentries = () => entries.value[id]
  //
  // window.__foo = () => (console.log({
  //   fromCollection: collection.value.find(entry => entry.id === id).participants,
  //   fromCollection2: collection2.value.find(entry => entry.id === id).participants,
  //   fromEntries: entries.value[id].participants,
  //   entriesIsReactive: isReactive(entries),
  // }))

  // helpers

  function hasId (id) {
    return Boolean(entries.value[id])
  }

  // run the fetcher on dependencies change

  // the props in dependencies are probably refs, should I unref them here/
  // TODO: meh, also I don't know how to automatically cleanup the old values...
  // onUnmount doesn't get called if we just switch groups... but the group id changes...
  let firstRun = true
  watch(() => dependencies, (value, oldValue, onInvalidate) => {
    const isValid = checkValid(() => value)
    if (firstRun && Object.keys(cache.entries).length > 0 && differenceInSeconds(new Date(), cache.updatedAt) < 30) {
      console.log('inintializing with old cache!')
      // entries.value = cache.entries
      // const now = new Date()
      // const keys = Object.values(cache.entries).filter(item => item.date > now).map(item => item.id).slice(0, 2)
      // const foo = {}
      // for (const key of keys) {
      //   foo[key] = cache.entries[key]
      // }
      // entries.value = foo
      entries.value = cache.entries
      // TODO: this is fucked cache really as it doesn't consider the parameters.... swrv maybe useful?
      console.log('initialized entries from cache to', entries.value, 'full cache was', cache.entries)
      Object.assign(status, cache.status)
      // we still need to fetch updates though, as we won't have been receiving websocket updates...
      // update in background...
      fetcher(dependencies, { update, reset, isValid })
    }
    else {
      withStatus(status, () => fetcher(value, { update, reset, isValid }))
    }
    // onInvalidate(() => {
    //   console.log('reset collection on invalidate')
    //   reset()
    // })
  }, { immediate: true })

  watchEffect(() => {
    cache.entries = entries.value
    cache.status = { ...status }
    cache.updatedAt = new Date()
  })

  onCacheMounted(() => {
    refreshIfStale()
  })

  onCacheExpired(() => {
    console.log('collection cache expired!')
    reset()
  })

  function checkValid (fn) {
    const initialValue = fn()
    return () => deepEqual(initialValue, fn())
  }

  // actions

  // just a play/example really...
  const STALE_SECONDS = 9999999 // disable for now
  function refreshIfStale () {
    if (status.finishedAt && status.finishedAt && !status.pending) {
      if (differenceInSeconds(new Date(), status.finishedAt) > STALE_SECONDS) {
        console.log(`data is more than ${STALE_SECONDS} seconds old! refreshing`)
        const isValid = checkValid(() => dependencies) // TODO: meh, is crappy, maybe just put the isValid in the fetcher...
        fetcher(dependencies, { update, reset, isValid }).catch(error => {
          // don't do much with errors, it's only background stuff...
          console.log('error with background refresh', error)
        })
      }
    }
  }

  // utilities

  function update (items) {
    entries.value = { ...unref(entries), ...indexById(items.map(markRaw)) }
    // cache.entries = entries.value
    // cache.updatedAt = new Date()
  }

  function reset () {
    console.log('resetting collection')
    entries.value = {}
    Object.assign(status, createStatus())
    // these should update in the watcher no?
    cache.entries = {}
    cache.status = {}
    cache.updatedAt = null

  }

  return {
    // getters
    collection,
    status: toRefs(status),

    // helpers
    hasId,

    // actions
    update,
    refreshIfStale,
  }
}
