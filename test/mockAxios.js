import MockAdapter from 'axios-mock-adapter'
import { pathToRegexp } from 'path-to-regexp'

import axios from '@/base/api/axios'

export const mockAxios = new MockAdapter(axios, { onNoMatch: 'throwException' })

export function createCursorPaginatedBackend (path, entries, getMatchFn, options) {
  const {
    pageSize = 30,
  } = options
  mockAxios.onGet(path).reply((config) => {
    const cursor = parseInt(config.params.cursor || '0')
    const matchFn = getMatchFn(config)
    const matches = entries.filter(entry => matchFn(entry))
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
      results,
      next: hasNextPage ? cursorURL(cursor + pageSize) : null,
      prev: hasPrevPage ? cursorURL(cursor - pageSize) : null,
    }]
  })
}

export function createGetByIdBackend (path, entries) {
  if (!path.includes(':id')) throw new Error('path must contain :id')
  const matcher = createPathMatcher(path)
  mockAxios.onGet(matcher).reply((config) => {
    const id = parseInt(matcher.getParams(config.url).id)
    const offer = entries.find(entry => entry.id === id)
    if (!offer) return [404]
    return [200, offer]
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
