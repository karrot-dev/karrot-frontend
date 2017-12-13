import Vue from 'vue'
import Vuex from 'vuex'
import Quasar from 'quasar'
import raf from 'raf'
import { createLocalVue, mount } from 'vue-test-utils'
import deepmerge from 'deepmerge'

import MockRouterLink from '>/MockRouterLink'
import i18n from '@/i18n'

Vue.use(Vuex)

export function createStore (mods, { debug = false } = {}) {
  let modules = {}
  for (let key of Object.keys(mods)) {
    modules[key] = {...mods[key], namespaced: true}
  }

  const store = new Vuex.Store({
    modules, strict: false,
  })

  if (debug) {
    store.subscribe(({type, payload}) => console.log('mutation', type, payload))
  }

  return store
}

export function throws (val) {
  return () => {
    if (typeof val === 'function') {
      val = val()
    }
    throw val
  }
}

export function makeFindAllIterable (wrapper) {
  const findAll = wrapper.constructor.prototype.findAll
  wrapper.findAll = function () {
    const wrapperArray = findAll.apply(this, arguments)
    wrapperArray[Symbol.iterator] = () => {
      let nextIndex = 0
      return {
        next () {
          if (nextIndex < wrapperArray.length) {
            return { value: wrapperArray.at(nextIndex++), done: false }
          }
          else {
            return { done: true }
          }
        },
      }
    }
    return wrapperArray
  }
  return wrapper
}

export function polyfillRequestAnimationFrame () {
  raf.polyfill()
}

export function mountWithDefaults (Component, options = {}) {
  const localVue = createLocalVue()
  localVue.component('router-link', MockRouterLink)
  localVue.use(Quasar)
  i18n.locale = 'en'
  const wrapper = mount(Component, { localVue, i18n, ...options })
  makeFindAllIterable(wrapper)
  return wrapper
}

export function createValidationError (data) {
  return Object.assign(new Error(), {
    response: {
      status: 403,
      data,
    },
  })
}

export function createRequestError () {
  return Object.assign(new Error(), {
    response: {
      status: 500,
      request: 'foo',
    },
  })
}

export function mockActionOnce (store, actionName) {
  const originalValue = store._actions[actionName]
  const restore = () => { store._actions[actionName] = originalValue }
  const mockFn = jest.fn()
  store._actions[actionName] = [async () => {
    try {
      return await mockFn()
    }
    finally {
      restore()
    }
  }]
  return mockFn
}

export function defaultActionStatus () {
  return { pending: false, validationErrors: {}, hasValidationErrors: false }
}

export function defaultActionStatusesFor (...actions) {
  const result = {}
  for (let action of actions) {
    result[action + 'Status'] = defaultActionStatus()
  }
  return result
}

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Helper for the interface of `withMeta` status and components (`statusMixin`)
 */
function statusMock (override) {
  const defaults = {
    pending: false,
    firstNonFieldError: undefined,
    hasValidationErrors: false,
    firstValidationError: undefined,
    validationErrors: {},
  }
  return deepmerge(defaults, override || {})
}

export const statusMocks = {
  default: statusMock,
  pending () {
    return statusMock({ pending: true })
  },
  validationError (field, message) {
    return statusMock({
      hasValidationErrors: true,
      firstValidationError: message,
      validationErrors: { [field]: [message] },
    })
  },
  nonFieldError (message) {
    return statusMock({
      firstNonFieldError: message,
      hasValidationErrors: true,
      firstValidationError: message,
      validationErrors: { nonFieldErrors: [message] },
    })
  },
}
