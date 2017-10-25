/**
 * Store independent helpers
 * If a helper depends on the vuex store, put it in storeHelpers.js
 */

/**
 * Returns an object that maps entries of iterables by their `id` field
 *
 * @param iterable array to be indexed
 * @returns {object}
 */
export function indexById (iterable) {
  return iterable.reduce((acc, cur, i) => {
    acc[cur.id] = cur
    return acc
  }, {})
}

export function onlyHandleAPIError (error, handleFn) {
  const { response: { status = -1, data } = {} } = error
  if (status >= 400 && status < 500) {
    handleFn({ error: data })
  }
  else {
    handleFn({ error })
    throw error
  }
}
