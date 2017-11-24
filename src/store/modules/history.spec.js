const mockGet = jest.fn()
jest.mock('@/services/api/history', () => ({ get: mockGet }))

import { createStore, throws, createValidationError } from '>/helpers'

describe('history module', () => {
  beforeEach(() => jest.resetModules())

  let store

  beforeEach(() => {
    store = createStore({
      history: require('./history'),
    })
  })

  it('throws routeError if historyId is not available', async () => {
    expect.assertions(2)
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    try {
      await store.dispatch('history/setActive', { historyId: 9999 })
    }
    catch (e) {
      expect(e.type).toEqual('RouteError')
    }
    expect(store.getters.active).toBeUndefined()
  })
})
