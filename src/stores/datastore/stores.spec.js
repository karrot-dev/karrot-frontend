const mockGet = jest.fn()
const mockGetStatistics = jest.fn()
jest.mock('@/stores/api/stores', () => ({ get: mockGet, statistics: mockGetStatistics }))

import { createDatastore, throws, createValidationError } from '>/helpers'

const groups = {
  getters: {
    get: () => id => ({ id }),
  },
}

describe('stores module', () => {
  beforeEach(() => jest.resetModules())

  let datastore

  let store1, store2, store3
  beforeEach(() => {
    datastore = createDatastore({
      stores: require('./stores').default,
      groups,
    })
  })

  beforeEach(() => {
    store1 = { id: 1, name: 'store 1' }
    store2 = { id: 2, name: 'store 2' }
    store3 = { id: 3, name: 'store 3' }
  })

  beforeEach(() => {
    datastore.commit('stores/set', [store1, store2, store3])
  })

  it('can update store', () => {
    const changed = { ...store1, name: 'new name' }
    datastore.commit('stores/update', [changed])
    expect(datastore.getters['stores/get'](changed.id).name).toEqual(changed.name)
  })

  it('throws routeError if store is not accessible', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    mockGetStatistics.mockImplementationOnce()
    await expect(datastore.dispatch('stores/selectStore', { storeId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
  })
})
