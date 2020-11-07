import {
  computed,
  markRaw,
  ref,
  unref,
} from '@vue/composition-api'
import { indexById } from '@/utils/datastore/helpers'
import { useFetcher } from '@/activities/data/useFetcher'

export function useCollection (params, fetcher) {
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
    entries.value = { ...unref(entries), ...indexById(items.map(markRaw)) }
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
