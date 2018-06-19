/**
 * Store dependent helpers
 */

import store from '@/store'

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

export function refresh () {
  store.dispatch('users/refresh')
  store.dispatch('stores/refresh')
  store.dispatch('pickups/refresh')
  store.dispatch('pickupSeries/refresh')
  store.dispatch('invitations/refresh')
  store.dispatch('history/refresh')
  store.dispatch('groups/refresh')
  store.dispatch('conversations/refresh')
  store.dispatch('feedback/refresh')
  store.dispatch('currentGroup/refresh')
  store.dispatch('auth/refresh')
}
