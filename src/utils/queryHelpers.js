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
