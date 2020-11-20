// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import {
  computed,
  // eslint-disable-next-line no-unused-vars
  markRaw,
  ref,
  unref,
} from '@vue/composition-api'
import { indexById } from '@/utils/datastore/helpers'
import { useFetcher } from '@/activities/data/useFetcher'

function defaultEnrich (value) {
  return value
}

export function useCollection (params, fetcher, enrich = defaultEnrich) {
  const { status } = useFetcher(params, { fetcher, onInvalidate })

  // state

  const entries = ref({})

  // getters

  const collection = computed(() => Object.keys(entries.value).map(id => entries.value[id]))

  // helpers

  function getById (id) {
    return Boolean(entries.value[id])
  }

  // utilities

  function update (items) {
    // entries.value = { ...unref(entries), ...indexById(items.map(enrich)) }
    // eslint-disable-next-line no-unreachable
    if (items.length > 10) {
      entries.value = { ...unref(entries), ...indexById(items.map(enrich)) }
    }
    else {
      for (const entry of items) {
        Vue.set(entries.value, entry.id, enrich(entry))
        // cannot update existing entry, because the computed parts would only have a reference to the original "entry", not the new one...
        // I wonder if I can make it reference itself?
        // console.log('updating entry', entry.id, entry)
        // const existingEntry = entries.value[entry.id]
        // if (existingEntry) {
        //   console.log('... existing! just updating props...', existingEntry, entry)
        //   Object.assign(existingEntry, entry)
        // }
        // else {
        //   Vue.set(entries.value, entry.id, enrich(entry))
        // }
      }
    }
  }

  function onInvalidate () {
    entries.value = {}
  }

  return {
    // getters
    collection,
    status,

    // helpers
    getById,

    // methods
    update,
  }
}
