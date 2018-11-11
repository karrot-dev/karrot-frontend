const mockGet = jest.fn()
jest.mock('@/history/api/history', () => ({ get: mockGet }))
jest.mock('@/base/i18n', () => ({ t: jest.fn() }))

import { createStore, throws, createValidationError } from '>/helpers'

describe('history module', () => {
  beforeEach(() => jest.resetModules())

  let store

  beforeEach(() => {
    store = createStore({
      history: require('./history').default,
      stores: { getters: { get: () => jest.fn() } },
      users: { getters: { get: () => jest.fn() } },
      groups: { getters: { get: () => jest.fn() } },
    })
  })

  it('updates the history list with correct sorting', () => {
    store.commit('history/update', [
      { id: 3, date: new Date('2017-11-21') },
      { id: 4, date: new Date('2017-11-20') },
    ])
    store.commit('history/update', [
      { id: 5, date: new Date('2017-10-21') },
      { id: 6, date: new Date('2017-10-20') },
    ])
    store.commit('history/update', [
      { id: 1, date: new Date('2017-12-21') },
      { id: 2, date: new Date('2017-12-20') },
    ])
    expect(store.getters['history/all'].map(e => e.id)).toEqual([6, 5, 4, 3, 2, 1])
  })

  it('can add a history entry', () => {
    const entry = { id: 10, group: 1, store: 1, users: [1], date: new Date('2018-01-20') }

    store.commit('history/update', [entry])
    expect(store.getters['history/all'][0].id).toEqual(entry.id)
  })

  it('throws routeError if historyId is not available', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(store.dispatch('history/setActive', { historyId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
    expect(store.getters['history/active']).toBeUndefined()
  })
})
