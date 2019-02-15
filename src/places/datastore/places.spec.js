const mockGet = jest.fn()
const mockGetStatistics = jest.fn()
jest.mock('@/places/api/places', () => ({ get: mockGet, statistics: mockGetStatistics }))

import { createDatastore, throws, createValidationError } from '>/helpers'

const groups = {
  getters: {
    get: () => id => ({ id }),
  },
}

describe('places module', () => {
  beforeEach(() => jest.resetModules())

  let datastore

  let store1, place2, store3
  beforeEach(() => {
    datastore = createDatastore({
      places: require('./places').default,
      groups,
    })
  })

  beforeEach(() => {
    store1 = { id: 1, name: 'place 1' }
    place2 = { id: 2, name: 'place 2' }
    store3 = { id: 3, name: 'place 3' }
  })

  beforeEach(() => {
    datastore.commit('places/set', [store1, place2, store3])
  })

  it('can update place', () => {
    const changed = { ...store1, name: 'new name' }
    datastore.commit('places/update', [changed])
    expect(datastore.getters['places/get'](changed.id).name).toEqual(changed.name)
  })

  it('throws routeError if place is not accessible', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    mockGetStatistics.mockImplementationOnce()
    await expect(datastore.dispatch('places/selectPlace', { placeId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
  })
})
