import { createStatus, withStatus } from '@/activities/data/actionStatus'
import { computed, reactive, ref, toRefs, unref } from '@vue/composition-api'
import deepEqual from 'deep-equal'

export function useCursorPagination ({ fetcher }) {
  const moreStatus = reactive(createStatus())
  const cursor = ref(null)
  const canFetchMore = computed(() => Boolean(unref(cursor)))

  async function fetchMore () {
    if (!unref(cursor)) return true
    const isValid = checkValid(() => unref(cursor))
    return withStatus(moreStatus, async () => {
      await fetcher(unref(cursor), { isValid })
      return !canFetchMore.value // true means nothing more to fetch
    })
  }

  function setCursor (value) {
    cursor.value = value
  }

  function invalidatePagination () {
    cursor.value = null
    Object.assign(moreStatus, createStatus())
  }

  return {
    moreStatus: toRefs(moreStatus),
    fetchMore,
    canFetchMore,
    setCursor,
    invalidatePagination,
  }
}

function checkValid (fn) {
  const initialValue = fn()
  const isValid = () => deepEqual(initialValue, fn())
  isValid.value = initialValue
  return isValid
}
