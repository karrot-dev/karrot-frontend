import mitt from 'mitt'
import { effectScope, isProxy, isRef, toRaw, unref } from 'vue'

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
  if (process.env.DEV) {
    window.karrot.services.length = 0
  }
}

export function defineService (serviceSetup) {
  if (process.env.DEV) {
    if (typeof serviceSetup !== 'function') {
      throw new Error('must pass a serviceSetup function to defineService')
    }
  }

  // hold a reference to our service instance in this outer scope so we always return the same one
  let service

  events.on('reset', () => {
    if (service) {
      service.$scope.stop()
      service = undefined
    }
  })

  return (...args) => {
    if (process.env.DEV) {
      if (args.length > 0) {
        throw new Error('you cannot pass args to a service as if it already existed they would be silently ignored...')
      }
    }
    // it's already setup, can just return our service instance
    if (service) return service

    // Create a detached scope so it will stay around beyond the lifecycle of the initial setup
    const scope = effectScope(true)

    // initialize our service in this scope, we get back a value, nothing fancy!
    service = scope.run(() => serviceSetup())
    service.$scope = scope

    if (process.env.DEV) {
      if (service) {
        // some services won't return anything, they just do some effects...
        window.karrot.services.push(service)
      }
    }

    return service
  }
}

if (process.env.DEV) {
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
