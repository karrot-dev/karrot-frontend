import { computed, unref } from 'vue'
import { isNetworkError, isServerError, isValidationError } from '@/utils/datastore/helpers'

export function extractCursor (url) {
  if (!url) return null
  return new URL(url, url.startsWith('http') ? null : 'https://karrot.world').searchParams.get('cursor')
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
