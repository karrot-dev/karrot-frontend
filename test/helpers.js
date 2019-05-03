import Vue from 'vue'
import Vuex from 'vuex'
import raf from 'raf'
import { createLocalVue, mount, TransitionStub, TransitionGroupStub, RouterLinkStub } from '@vue/test-utils'
import deepmerge from 'deepmerge'
import i18n from '@/base/i18n'
import router from '@/base/router'

Vue.use(Vuex)

Object.defineProperty(window.navigator, 'userAgent', (userAgent => {
  return {
    get () {
      return userAgent
    },
    set (newVal) {
      userAgent = newVal
    },
  }
})(window.navigator.userAgent))

const desktopUserAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0'
const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A356 Safari/604.1'

export function useDesktopUserAgent () {
  window.navigator.userAgent = desktopUserAgent
}

export function useMobileUserAgent () {
  window.navigator.userAgent = mobileUserAgent
}

export async function nextTicks (n) {
  while (n--) {
    await Vue.nextTick()
  }
}

export function createDatastore (mods, { debug = false, plugins = [] } = {}) {
  let modules = {}
  for (let key of Object.keys(mods)) {
    modules[key] = { ...mods[key], namespaced: true }
  }

  const datastore = new Vuex.Store({
    modules, plugins, strict: false,
  })

  if (debug) {
    datastore.subscribe(({ type, payload }) => console.log('mutation', type, payload))
    datastore.subscribeAction(({ type, payload }) => console.log('action', type, payload))
  }

  return datastore
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

export function configureQuasar (Vue) {
  const configure = require('@/base/configureQuasar').default
  configure(Vue)
}

export function mountWithDefaults (Component, options = {}) {
  const localVue = createLocalVue()
  return mountWithDefaultsAndLocalVue(Component, localVue, options)
}

export function mountWithDefaultsAndLocalVue (Component, localVue, options = {}) {
  configureQuasar(localVue)
  i18n.locale = 'en'
  localVue.component('RouterLink', RouterLinkStub)
  localVue.component('Transition', TransitionStub)
  localVue.component('TransitionGroup', TransitionGroupStub)
  const datastore = options.datastore
  delete options.datastore
  const wrapper = mount(Component, {
    router,
    localVue,
    i18n,
    sync: false,
    store: datastore,
    ...options,
  })
  makeFindAllIterable(wrapper)
  return wrapper
}

export function storybookDefaults (options) {
  i18n.locale = 'en'
  return {
    router,
    i18n,
    ...options,
  }
}

export function createValidationError (data) {
  return Object.assign(new Error(), {
    response: {
      status: 400,
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

export function mockActionOnce (datastore, actionName) {
  const originalValue = datastore._actions[actionName]
  const restore = () => { datastore._actions[actionName] = originalValue }
  const mockFn = jest.fn()
  datastore._actions[actionName] = [async () => {
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
  return {
    pending: false,
    validationErrors: {},
    hasValidationErrors: false,
    serverError: false,
    networkError: false,
    startedAt: null,
  }
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
    ...defaultActionStatus(),
    firstNonFieldError: undefined,
    firstValidationError: undefined,
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
