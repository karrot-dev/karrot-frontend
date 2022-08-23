import { mount, RouterLinkStub } from '@vue/test-utils'
import deepmerge from 'deepmerge'
import { isArray, mergeWith } from 'lodash'
import { nextTick } from 'vue'
import { VueQueryPlugin } from 'vue-query'

import i18n, { i18nPlugin } from '@/base/i18n'
import queryClient from '@/base/queryClient'

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
    await nextTick()
  }
}

// TODO: remove all calls to this
export function createDatastore (mods = {}, { debug = false, plugins = [] } = {}) {
  console.warn('datastores are no more! (created an empty object)')
  return {}
}

export function throws (val) {
  return () => {
    if (typeof val === 'function') {
      val = val()
    }
    throw val
  }
}

export function makefindAllComponentsIterable (wrapper) {
  const findAllComponents = wrapper.constructor.prototype.findAllComponents
  wrapper.findAllComponents = function () {
    const wrapperArray = findAllComponents.apply(this, arguments)
    wrapperArray[Symbol.iterator] = () => {
      let nextIndex = 0
      return {
        next () {
          if (nextIndex < wrapperArray.length) {
            return { value: wrapperArray[nextIndex++], done: false }
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

export function withDefaults (options = {}) {
  // jest.resetModules() can only provide isolation when we require() a module
  // We want a fresh Quasar for every test
  const Quasar = require('quasar').Quasar
  const quasarConfig = require('>/quasarConfig').default
  // Use a fresh queryClient each time or we end up with data sharing between tests
  const { queryClient } = require('@/base/vue-query')
  // For some reason StandardMap.spec.js fails if propsData comes after global
  const { propsData } = options
  delete options.propsData
  const defaults = {
    propsData,
    global: {
      config: {
        // TODO: should be able to remove this with vue v3.3.x
        unwrapInjectedRef: true,
      },
      plugins: [
        [Quasar, quasarConfig],
        [VueQueryPlugin, { queryClient }],
        i18nPlugin,
      ],
      stubs: {
        RouterLink: RouterLinkStub,
      },
      directives: {
        measure: {},
      },
      mocks: {
        $icon: () => '',
      },
    },
  }
  // Performs a deep merge
  return mergeWith(
    defaults,
    options,
    (objValue, srcValue) => {
      if (isArray(objValue)) {
        return objValue.concat(srcValue)
      }
    },
  )
}

export function mountWithDefaults (Component, options = {}) {
  i18n.locale = 'en'

  const mergedOptions = withDefaults(options)

  if (options.datastore) mergedOptions.global.plugins.unshift(options.datastore)

  const wrapper = mount(Component, mergedOptions)
  makefindAllComponentsIterable(wrapper)
  return wrapper
}

export function storybookDefaults (options) {
  return {
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
