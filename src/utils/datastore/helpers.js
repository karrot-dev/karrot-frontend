import mitt from 'mitt'
import { effectScope, isProxy, isRef, toRaw, unref, getCurrentInstance } from 'vue'

import { isObject } from '@/utils/utils'

/**
 * Datastore related helpers
 * This file should not import the datastore itself, to avoid cyclic dependencies.
 */

/**
 * Returns an object that maps entries of iterables by their `id` field
 *
 * @param iterable array to be indexed
 * @returns {object}
 */
export function indexById (iterable) {
  return indexBy(iterable, 'id')
}

export function indexBy (iterable, key) {
  return iterable.reduce((acc, cur, i) => {
    acc[cur[key]] = cur
    return acc
  }, {})
}

export function isValidationError (error) {
  if (!error) return false
  const { response: { status = -1 } = {} } = error
  if (status >= 400 && status < 500) {
    return true
  }
  return false
}

export function isServerError (error) {
  if (!error) return false
  const { response: { status = -1 } = {} } = error
  if (status >= 500) {
    return true
  }
  return false
}

export function isNetworkError (error) {
  if (error && error.message === 'Network Error') {
    return true
  }
  return false
}

const events = mitt()

/**
 * This is important for testing, so we don't keep services around between tests
 */
export function resetServices () {
  events.emit('reset')
  if (import.meta.env.DEV) {
    window.karrot.services.length = 0
  }
}

/**
 * Define a singleton service that can be used as a composable.
 *
 * e.g. defining a singleton foo service...
 *
 * // define in a services file somewhere
 *
 * export const useFoo = defineService(() => {
 *
 *   function blah () {
 *     return 'blah'
 *   }
 *
 *   return {
 *     getBlah,
 *   }
 * })
 *
 * // elsewhere in a setup function
 *
 * const { getBlah } = useFoo()
 *
 * getBlah()
 *
 * @template T
 * @param {function(): T} serviceSetup
 * @returns {function(): T}
 */
export function defineService (serviceSetup) {
  if (import.meta.env.DEV) {
    if (typeof serviceSetup !== 'function') {
      throw new Error('must pass a serviceSetup function to defineService')
    }
  }

  // hold a reference to our service instance in this outer scope so we always return the same one
  let service

  events.on('reset', () => {
    if (service) {
      if (import.meta.env.DEV) {
        const idx = window.karrot.services.indexOf(service)
        if (idx !== -1) window.karrot.services.splice(idx, 1)
      }
      service.$scope.stop()
      service = undefined
    }
  })

  return (...args) => {
    if (import.meta.env.DEV) {
      if (args.length > 0) {
        throw new Error('you cannot pass args to a service as if it already existed they would be silently ignored...')
      }
    }
    // it's already setup, can just return our service instance
    if (service) return service

    if (!getCurrentInstance()) {
      throw new Error('Cannot setup services without a current vue instance :/')
    }

    // Create a detached scope so it will stay around beyond the lifecycle of the initial setup
    const scope = effectScope(true)

    // initialize our service in this scope, we get back a value, nothing fancy!
    service = scope.run(() => serviceSetup()) || {}
    service.$scope = scope

    if (import.meta.env.DEV) {
      if (service) {
        // some services won't return anything, they just do some effects...
        window.karrot.services.push(service)
      }
    }

    return service
  }
}

if (import.meta.env.DEV) {
  if (!window.karrot) window.karrot = {}
  window.karrot.services = []
  window.karrot.walkServices = walkServices

  function walkServices () {
    function unwrap (value) {
      if (!value) return value
      if (isRef(value)) return unwrap(unref(value))
      else if (isProxy(value)) return unwrap(toRaw(value))
      else if (Array.isArray(value)) return value.map(unwrap)
      else if (isObject(value)) {
        return Object.entries(value).reduce((acc, [key, val]) => {
          acc[key] = unwrap(val)
          return acc
        }, {})
      }
      else return value
    }

    for (const service of window.karrot.services) {
      const keys = Object.keys(service)
      if (keys.length > 0) {
        console.log('service -----------------------------------------')
        // the service might just return one value
        if (isRef(service)) {
          console.log('service', '->', unwrap(service))
        }
        else {
          for (const key of keys) {
            const value = service[key]
            const unwrapped = unwrap(value)
            if (typeof unwrapped !== 'function') {
              console.log(key, '->', unwrapped)
            }
          }
        }
      }
    }
  }
}
