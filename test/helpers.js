import Vue from 'vue'
import Vuex from 'vuex'
import { createLocalVue, mount, TransitionStub, TransitionGroupStub, RouterLinkStub } from '@vue/test-utils'
import deepmerge from 'deepmerge'
import i18n from '@/base/i18n'
import { IconPlugin } from '@/base/icons'
import routerMocks from '>/routerMocks'

Vue.use(Vuex)
Vue.use(IconPlugin)

const desktopUserAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0'
const mobileUserAgent = 'Mozilla/5.0 (Android 9; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0'

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
  const modules = {}
  for (const key of Object.keys(mods)) {
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

export function configureQuasar (Vue) {
  // jest.resetModules() can only provide isolation when we require() a module
  // We want a fresh Quasar for every test
  const configure = require('@/base/configureQuasar').default
  configure(Vue)
}

export function mountWithDefaults (Component, options = {}) {
  const localVue = createLocalVue()
  return mountWithDefaultsAndLocalVue(Component, localVue, options)
}

export function mountWithDefaultsAndLocalVue (Component, localVue, options = {}) {
  i18n.locale = 'en'
  configureQuasar(localVue)

  localVue.component('RouterLink', RouterLinkStub)
  localVue.component('Transition', TransitionStub)
  localVue.component('TransitionGroup', TransitionGroupStub)
  localVue.directive('measure', {})
  const datastore = options.datastore
  delete options.datastore
  const wrapper = mount(Component, {
    localVue,
    sync: false,
    i18n,
    store: datastore,
    mocks: {
      ...routerMocks,
    },
    ...options,
  })
  makeFindAllIterable(wrapper)
  return wrapper
}

export function storybookDefaults (options) {
  i18n.locale = 'en'
  return {
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
  for (const action of actions) {
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

export const range = n => [...Array(n).keys()]
