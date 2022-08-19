import { computed, unref } from 'vue'
import { useQueryClient } from 'vue-query'

import { isNetworkError, isServerError, isValidationError } from '@/utils/datastore/helpers'

export function useQueryHelpers () {
  const queryClient = useQueryClient()

  /**
   * For updating non-paginated list data, if it exists, it'll be replaced, otherwise the query invalidated
   */
  function updateOrInvalidateListEntry (queryKey, updatedEntry) {
    let updated = false
    const data = queryClient.getQueryData(queryKey)
    const hasEntry = data && data.some(entry => entry.id === updatedEntry.id)
    if (hasEntry) {
      // Update existing value
      queryClient.setQueryData(queryKey, updateNonPaginatedDataWith(updatedEntry, () => {
        updated = true
      }))
    }
    else {
      // Not present, probably new, let's invalidate...
      queryClient.invalidateQueries(queryKey)
      updated = false
    }
    return updated
  }

  function maybeUpdateDataWith (updatedEntry, onUpdated = () => {}) {
    return data => {
      if (data === undefined) return data
      if (data.pages) return updatePaginatedDataWith(updatedEntry, onUpdated)(data)
      else if (Array.isArray(data)) return updateNonPaginatedDataWith(updatedEntry, onUpdated)(data)
      onUpdated()
      return updatedEntry
    }
  }

  function updateNonPaginatedDataWith (updatedEntry, onUpdated) {
    return data => {
      if (data === undefined) return data
      const hasEntry = data.some(entry => entry.id === updatedEntry.id)
      if (!hasEntry) return data
      onUpdated()
      return data.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
    }
  }

  function updatePaginatedDataWith (updatedEntry, onUpdated) {
    return data => {
      if (data === undefined) return data
      const { pages, pageParams } = data
      const hasEntry = pages.some(page => page.results.some(entry => entry.id === updatedEntry.id))
      if (!hasEntry) return data
      onUpdated()
      return {
        pages: pages.map(page => ({
          ...page,
          results: page.results.map(entry => {
            return entry.id === updatedEntry.id ? updatedEntry : entry
          }),
        })),
        pageParams,
      }
    }
  }

  return {
    updateOrInvalidateListEntry,
    maybeUpdateDataWith,
  }
}

export function extractCursor (url) {
  if (!url || !url.includes('?')) return null
  return new URLSearchParams(url.substring(url.indexOf('?'))).get('cursor')
}

export function withStatus (mutation) {
  return {
    ...mutation,
    // TODO: mutation.status is a thing too... maybe return as mutationStatus ?
    status: computed(() => mutationToStatus(mutation)),
  }
}

// enrich with a shortcut to first error message, if any
function firstError (errList) {
  if (!errList || !Array.isArray(errList) || errList.length < 1) return
  const value = errList[0]

  if (typeof value === 'string') {
    return value
  }
  return value[0]
}

/**
 * Converts a vue-query mutation object to our existing "status" object type
 */
export function mutationToStatus (mutation) {
  const error = unref(mutation.error)
  const validationErrors = isValidationError(error) ? error.response.data : []

  const firstValidationError = firstError(Object.values(validationErrors))
  const firstNonFieldError = firstError([
    validationErrors.nonFieldErrors,
    validationErrors.detail,
  ].filter(Boolean))

  return {
    validationErrors,
    hasValidationErrors: validationErrors.length > 0,
    pending: mutation.isLoading.value,
    serverError: isServerError(error),
    networkError: isNetworkError(error),
    firstValidationError,
    firstNonFieldError,
  }
}

export function flattenPaginatedData (query) {
  // Flatten the pages, so we have a single offers array with all the results in
  return computed(() => {
    const data = unref(query.data)
    if (!data) return []
    return data.pages.flat()
  })
}

/**
 * Useful for dateMin param for activity queries, so we can keep a cache.
 * If we used new Date() then the cache params would keep changing...
 *
 * @returns {Date}
 */
export function newDateRoundedTo5Minutes () {
  const roundTo = 1000 * 60 * 5 // 5 minutes
  return new Date(Math.floor(new Date().getTime() / roundTo) * roundTo)
}

/**
 * If we want to wait for a certain query to be done regardless of whether it errors.
 *
 * I thought the suspense() function from the vue-query object would do this...
 * ... but it causes it to refetch it which is not what I want
 */
export function useWait (query) {
  const {
    status,
    fetchStatus,
    suspense,
    isPlaceholderData,
  } = query
  return async function wait () {
    // TODO: I'm not convinced this is quite right...
    if (!isPlaceholderData.value && status.value === 'success' && fetchStatus.value === 'idle') {
      return
    }
    try {
      await suspense()
    }
    // We don't mind error, just that we're not waiting any more
    catch (error) {}
  }
}
