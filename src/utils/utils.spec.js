// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { underscorize, objectDiff, debounceAndFlushOnUnload } from './utils'

describe('utils', () => {
  it('underscorizes', () => {
    expect(underscorize('displayName')).toEqual('display_name')
  })
})

describe('objectDiff', () => {
  it('works', () => {
    expect(objectDiff({ a: 'cat', b: 'calm' }, { a: 'mouse', b: 'calm' })).toEqual({ a: 'mouse' })
  })
})

describe('debounceAndFlushBeforeUnload', () => {
  let listeners
  beforeEach(() => {
    listeners = {}
    jest.spyOn(window, 'addEventListener').mockImplementation((event, fn) => {
      listeners[event] = fn
    })
  })
  afterEach(() => jest.restoreAllMocks())
  it('calls handler if triggered', () => {
    const mock = jest.fn()
    debounceAndFlushOnUnload(mock, 1000)()
    listeners.unload()
    expect(mock).toBeCalled()
  })
  it('does not call handler if not triggered', () => {
    const mock = jest.fn()
    debounceAndFlushOnUnload(mock, 1000)
    listeners.unload()
    expect(mock).not.toBeCalled()
  })
})
