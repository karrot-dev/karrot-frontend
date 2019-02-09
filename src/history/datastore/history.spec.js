const mockGet = jest.fn()
jest.mock('@/history/api/history', () => ({ get: mockGet }))
jest.mock('@/base/i18n', () => ({ t: jest.fn() }))

import { createDatastore, throws, createValidationError } from '>/helpers'

describe('history module', () => {
  beforeEach(() => jest.resetModules())

  let datastore

  beforeEach(() => {
    datastore = createDatastore({
      history: require('./history').default,
      places: { getters: { get: () => jest.fn() } },
      users: { getters: { get: () => jest.fn() } },
      groups: { getters: { get: () => jest.fn() } },
    })
  })

  it('updates the history list with correct sorting', () => {
    datastore.commit('history/update', [
      { id: 3, date: new Date('2017-11-21') },
      { id: 4, date: new Date('2017-11-20') },
    ])
    datastore.commit('history/update', [
      { id: 5, date: new Date('2017-10-21') },
      { id: 6, date: new Date('2017-10-20') },
    ])
    datastore.commit('history/update', [
      { id: 1, date: new Date('2017-12-21') },
      { id: 2, date: new Date('2017-12-20') },
    ])
    expect(datastore.getters['history/all'].map(e => e.id)).toEqual([6, 5, 4, 3, 2, 1])
  })

  it('can add a history entry', () => {
    const entry = { id: 10, group: 1, place: 1, users: [1], date: new Date('2018-01-20') }

    datastore.commit('history/update', [entry])
    expect(datastore.getters['history/all'][0].id).toEqual(entry.id)
  })

  it('throws routeError if historyId is not available', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(datastore.dispatch('history/setActive', { historyId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
    expect(datastore.getters['history/active']).toBeUndefined()
  })
})
