import { computed, unref } from 'vue'
import { isNetworkError, isServerError, isValidationError } from '@/utils/datastore/helpers'
import { useQueryClient } from 'vue-query'

export function useQueryHelpers () {
  const queryClient = useQueryClient()

  /**
   * For updating non-paginated list data, if it exists, it'll be replaced, otherwise the query invalidated
   */
  function updateOrInvalidateListEntry (queryKey, updatedEntry) {
    const hasEntry = queryClient.getQueryData(queryKey).some(entry => entry.id === updatedEntry.id)
    if (hasEntry) {
      // Update existing value
      queryClient.setQueryData(queryKey, entries => {
        const idx = entries.findIndex(entry => entry.id === updatedEntry.id)

        // Entry not present after all :/ nothing to do
        if (idx === -1) return entries

        // Clone our existing list
        const updatedEntries = [...entries]

        // Delete old entry, and replace with updated one
        updatedEntries.splice(idx, 1, updatedEntry)

        return updatedEntries
      })
    }
    else {
      // Not present, probably new, let's invalidate...
      queryClient.invalidateQueries(queryKey)
    }
  }

  return {
    updateOrInvalidateListEntry,
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
