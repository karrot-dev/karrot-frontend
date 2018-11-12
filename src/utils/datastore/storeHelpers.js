/**
 * Store dependent helpers
 */

import datastore from '@/base/datastore'

/**
 * Create a function that refers to a getter that you can use in `datastore.watch()`
 *
 * @param getterName namespaced getter name
 * @param args will be passed to the getter if it is a function
 * @returns {function()}
 */
export function getter (getterName, ...args) {
  return (...moreArgs) => {
    let getter = datastore.getters[getterName]
    if (typeof getter === 'function') {
      return getter(...args, ...moreArgs)
    }
    else {
      return getter
    }
  }
}
