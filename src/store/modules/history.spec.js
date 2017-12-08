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

  it('updates the history list', () => {
    store.commit('history/update', { entries: [
      { id: 3, date: new Date('2017-11-21') },
      { id: 4, date: new Date('2017-11-20') },
    ]})
    store.commit('history/update', { entries: [
      { id: 5, date: new Date('2017-10-21') },
      { id: 6, date: new Date('2017-10-20') },
    ]})
    store.commit('history/update', { entries: [
      { id: 1, date: new Date('2017-12-21') },
      { id: 2, date: new Date('2017-12-20') },
    ]})
    expect(store.state.history.idList).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('throws routeError if historyId is not available', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(store.dispatch('history/setActive', { historyId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
    expect(store.getters['history/active']).toBeUndefined()
  })
})
