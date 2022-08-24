import MockAdapter from 'axios-mock-adapter'
import { pathToRegexp } from 'path-to-regexp'
import 'blob-polyfill'

import axios from '@/base/api/axios'
import { camelizeKeys, underscorizeKeys } from '@/utils/utils'

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

export function get (path, handler, options = {}) {
  on('get', path, handler, options)
}

export function post (path, handler, options = {}) {
  on('post', path, handler, options)
}

export function patch (path, handler, options = {}) {
  on('patch', path, handler, options)
}

function on (method, path, handler, options = {}) {
  const {
    requireAuth = true,
  } = options
  const mockAxios = ensureMockAxios()
  function onRequest (path) {
    switch (method) {
      case 'get': return mockAxios.onGet(path)
      case 'post': return mockAxios.onPost(path)
      case 'patch': return mockAxios.onPatch(path)
      default: throw new Error('have not implemented method: ' + method)
    }
  }
  // If we have a path with params/:like/:this/, we  match/extract them
  // They are available to the handler as pathParams
  const matcher = path.includes(':') ? createPathMatcher(path) : null
  onRequest(matcher || path).reply(async config => {
    if (!ctx.authUser && requireAuth) return notAuthenticated()
    if (matcher) {
      config.pathParams = matcher.getParams(config.url)
    }
    if (['post', 'patch', 'put'].includes(config.method)) {
      if (config.data instanceof FormData) {
        // This is the reverse of toFormData (but ignoring the images)
        config.data = camelizeKeys(JSON.parse(await config.data.get('document').text()))
      }
      else if (
        typeof config.data === 'string' &&
          config.headers['Content-Type'] === 'application/json'
      ) {
        config.data = camelizeKeys(JSON.parse(config.data))
      }
    }
    const handlerResponse = handler(config)
    if (!Array.isArray(handlerResponse)) throw new Error('mock handler must return an array')
    const [statusCode, body] = handlerResponse
    if (typeof statusCode !== 'number') throw new Error('mock handler array must have numeric status code as first arg')
    return [statusCode, body && underscorizeKeys(body)]
  })
}

export function cursorPaginated (path, getEntries, options = {}) {
  get(path, config => {
    const pageSize = ctx.pageSize || 30
    const cursor = parseInt(config.params.cursor || '0')
    const entries = getEntries(config)
    const results = entries.slice(cursor, cursor + pageSize)
    const hasNextPage = entries.length > (cursor + pageSize)
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
      results,
      next: hasNextPage ? cursorURL(cursor + pageSize) : null,
      prev: hasPrevPage ? cursorURL(cursor - pageSize) : null,
    }]
  }, options)
}

export function getById (path, getEntries, options = {}) {
  const {
    requireAuth = true,
  } = options
  if (!path.includes(':id')) throw new Error('path must contain :id')
  get(path, ({ pathParams }) => {
    if (!ctx.authUser && requireAuth) return notAuthenticated()
    const id = parseInt(pathParams.id)
    const entry = getEntries().find(entry => entry.id === id)
    if (!entry) return [404]
    return [200, entry]
  }, options)
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
