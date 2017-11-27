const mockGet = jest.fn()
jest.mock('@/services/api/history', () => ({ get: mockGet }))

import { createStore, throws, createValidationError } from '>/helpers'

describe('history module', () => {
  beforeEach(() => jest.resetModules())

  let store

  beforeEach(() => {
    store = createStore({
      history: require('./history').default,
    })
  })

  it('throws routeError if historyId is not available', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(store.dispatch('history/setActive', { historyId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
    expect(store.getters['history/active']).toBeUndefined()
  })
})
