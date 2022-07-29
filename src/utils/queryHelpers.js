import { computed, unref } from 'vue'
import { isNetworkError, isServerError, isValidationError } from '@/utils/datastore/helpers'

export function extractCursor (url) {
  if (!url || !url.includes('?')) return null
  return new URLSearchParams(url.substring(url.indexOf('?'))).get('cursor')
}

export function withStatus (mutation) {
  return {
    ...mutation,
    status: computed(() => mutationToStatus(mutation)),
  }
}

/**
 * Converts a vue-query mutation object to our existing "status" object type
 */
export function mutationToStatus (mutation) {
  const error = unref(mutation.error)
  const validationErrors = isValidationError(error) ? error.response.data : []
  return {
    validationErrors,
    hasValidationErrors: validationErrors.length > 0,
    pending: mutation.isLoading.value,
    serverError: isServerError(error),
    networkError: isNetworkError(error),
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
