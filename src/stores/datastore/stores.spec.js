const mockGet = jest.fn()
const mockGetStatistics = jest.fn()
jest.mock('@/stores/api/stores', () => ({ get: mockGet, statistics: mockGetStatistics }))

import { createStore, throws, createValidationError } from '>/helpers'

const groups = {
  getters: {
    get: () => id => ({ id }),
  },
}

describe('stores module', () => {
  beforeEach(() => jest.resetModules())

  let store

  let store1, store2, store3
  beforeEach(() => {
    store = createStore({
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
    store.commit('stores/set', [store1, store2, store3])
  })

  it('can update store', () => {
    const changed = { ...store1, name: 'new name' }
    store.commit('stores/update', [changed])
    expect(store.getters['stores/get'](changed.id).name).toEqual(changed.name)
  })

  it('throws routeError if store is not accessible', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    mockGetStatistics.mockImplementationOnce()
    await expect(store.dispatch('stores/selectStore', { storeId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
  })
})
