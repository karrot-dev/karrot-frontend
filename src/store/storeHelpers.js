/**
 * Store dependent helpers
 */

import { mapGetters } from 'vuex'
import store from '@/store'

export function mapGetterMethods (mapping) {
  // TODO remove?
  let ctx = {
    $store: store,
  }
  let methods = mapGetters(mapping)

  for (let key of Object.keys(methods)) {
    methods[key] = methods[key].call(ctx)
  }

  return methods
}

/**
 * Create a function that refers to a getter that you can use in `store.watch()`
 *
 * @param getterName namespaced getter name
 * @param args will be passed to the getter if it is a function
 * @returns {function()}
 */
export function getter (getterName, ...args) {
  return (...moreArgs) => {
    let getter = store.getters[getterName]
    if (typeof getter === 'function') {
      return getter(...args, ...moreArgs)
    }
    else {
      return getter
    }
  }
}
