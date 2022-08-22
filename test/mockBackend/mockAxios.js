import MockAdapter from 'axios-mock-adapter'
import { pathToRegexp } from 'path-to-regexp'

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

export function createBackend (path, fn, options = {}) {
  const {
    requireAuth = true,
  } = options
  ensureMockAxios().onGet(path).reply(() => {
    if (!ctx.authUser && requireAuth) return notAuthenticated()
    return [200, underscorizeKeys(fn())]
  })
}

export function createCursorPaginatedBackend (path, getEntries, getMatchFn, options = {}) {
  const {
    requireAuth = true,
  } = options
  ensureMockAxios().onGet(path).reply((config) => {
    if (!ctx.authUser && requireAuth) return notAuthenticated()
    const pageSize = ctx.pageSize || 30

    const cursor = parseInt(config.params.cursor || '0')
    const matchFn = getMatchFn(config)
    const matches = getEntries().filter(entry => matchFn(entry))
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
    const offer = getEntries().find(entry => entry.id === id)
    if (!offer) return [404]
    return [200, underscorizeKeys(offer)]
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
