import { configure } from '@testing-library/vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import deepmerge from 'deepmerge'
import { isArray, mergeWith } from 'lodash'
import { vi } from 'vitest'
import { nextTick } from 'vue'
import { VueQueryPlugin } from 'vue-query'
import { getRouter } from 'vue-router-mock'

import i18n, { i18nPlugin } from '@/base/i18n'

const desktopUserAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0'
const mobileUserAgent = 'Mozilla/5.0 (Android 9; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0'

configure({
  asyncUtilTimeout: 60 * 1000,
})

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

export async function withDefaults (options = {}) {
  // TODO: update the next comment for vite!
  // vi.resetModules() can only provide isolation when we require() a module
  // We want a fresh Quasar for every test
  const { Quasar } = await import('quasar/dist/quasar.esm')
  const quasarConfig = (await import('>/quasarConfig')).default
  // Use a fresh queryClient each time or we end up with data sharing between tests
  const queryClient = (await import('@/base/queryClient')).default
  // For some reason StandardMap.spec.js fails if propsData comes after global
  const { propsData } = options
  delete options.propsData

  const router = getRouter()

  const defaults = {
    propsData,
    global: {
      plugins: [
        router,
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

export async function mountWithDefaults (Component, options = {}) {
  // const i18n = require('@/base/i18n').default
  i18n.locale = 'en'

  const mergedOptions = await withDefaults(options)

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
  const mockFn = vi.fn()
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

export async function invalidateQueries () {
  await flushPromises()
  await flushPromises()
  // TODO: add mock websockets, for now we need to manually invalidate...
  await (await import('@/base/queryClient')).default.invalidateQueries()
  await flushPromises()
  await flushPromises()
}

export const range = n => [...Array(n).keys()]
