import MockAdapter from 'axios-mock-adapter'
import { pathToRegexp } from 'path-to-regexp'
import 'blob-polyfill'

import axios from '@/base/api/axios'
import { underscorizeKeys } from '@/utils/utils'

import { ctx } from './index'

// holds the current context for the mock axios
/**
 * @type {MockAdapter}
 */
let mockAxios

export function initializeMockAxios () {
  if (mockAxios) throw new Error('already have a mock!')
  mockAxios = new MockAdapter(axios, { onNoMatch: 'throwException' })
}

export function resetMockAxios () {
  if (mockAxios) {
    // resets the state
    mockAxios.reset()
    // restores axios back to how it was (maybe enough on it's own?)
    mockAxios.restore()
  }
  mockAxios = null
}

/**
 * @returns {MockAdapter}
 */
function ensureMockAxios () {
  if (!mockAxios) throw new Error('no mock in this context!')
  return mockAxios
}

function notAuthenticated () {
  return [
    403,
    {
      detail: 'Authentication credentials were not provided.',
      error_code: 'not_authenticated',
    },
  ]
}

export class ValidationError extends Error {
  constructor (statusCode) {
    super()
    this.statusCode = statusCode
  }
}

export function createBackend (method, path, fn, options = {}) {
  const {
    requireAuth = true,
  } = options
  const mockAxios = ensureMockAxios()
  function on (path) {
    switch (method) {
      case 'get': return mockAxios.onGet(path)
      case 'post': return mockAxios.onPost(path)
      default: throw new Error('have not implemented method: ' + method)
    }
  }
  on(path).reply(async config => {
    if (!ctx.authUser && requireAuth) return notAuthenticated()
    try {
      if (method === 'post') {
        let data = config.data
        if (data instanceof FormData) {
          // This is the reverse of toFormData (but ignoring the images)
          data = JSON.parse(await config.data.get('document').text())
        }
        return [200, underscorizeKeys(fn(data))]
      }
      else {
        return [200, underscorizeKeys(fn())]
      }
    }
    catch (error) {
      if (error instanceof ValidationError) {
        return [error.statusCode]
      }
      throw error
    }
  })
}

// function toText (blob) {
//   return new Promise(resolve => {
//     const reader = new FileReader()
//     console.log('waiting for file reader')
//     reader.addEventListener('load', () => {
//       console.log('loaded!', reader.result)
//       resolve(reader.result)
//     }, false)
//     reader.readAsText(blob)
//   })
// }

export function createCursorPaginatedBackend (path, getAllEntries, getFilterFn, options = {}) {
  const {
    requireAuth = true,
  } = options
  ensureMockAxios().onGet(path).reply((config) => {
    if (!ctx.authUser && requireAuth) return notAuthenticated()
    const pageSize = ctx.pageSize || 30

    const cursor = parseInt(config.params.cursor || '0')
    const filterFn = getFilterFn(config)
    const entries = getAllEntries()
    const matches = entries.filter(entry => filterFn(entry))
    const results = matches.slice(cursor, cursor + pageSize)
    const hasNextPage = matches.length > (cursor + pageSize)
    const hasPrevPage = cursor > 0

    function cursorURL (newCursor) {
      const searchParams = new URLSearchParams()
      for (const name in config.params) {
        if (name !== 'cursor') {
          searchParams.append(name, config.params[name])
        }
      }
      searchParams.append('cursor', newCursor)
      return `${path}?${searchParams.toString()}`
    }

    return [200, {
      results: underscorizeKeys(results),
      next: hasNextPage ? cursorURL(cursor + pageSize) : null,
      prev: hasPrevPage ? cursorURL(cursor - pageSize) : null,
    }]
  })
}

export function createGetByIdBackend (path, getEntries, options = {}) {
  const {
    requireAuth = true,
  } = options
  if (!path.includes(':id')) throw new Error('path must contain :id')
  const matcher = createPathMatcher(path)
  ensureMockAxios().onGet(matcher).reply((config) => {
    if (!ctx.authUser && requireAuth) return notAuthenticated()
    const id = parseInt(matcher.getParams(config.url).id)
    const entry = getEntries().find(entry => entry.id === id)
    if (!entry) return [404]
    return [200, underscorizeKeys(entry)]
  })
}

/**
 * Use for doing path param matching for axios-mock-adapter
 */
function createPathMatcher (path) {
  const keys = []
  const re = pathToRegexp(path, keys)
  re.getParams = url => {
    const m = re.exec(url)
    const params = {}
    m.slice(1).forEach((val, idx) => {
      params[keys[idx].name] = val
    })
    return params
  }
  return re
}
