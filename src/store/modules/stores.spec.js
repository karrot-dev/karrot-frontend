const mockGet = jest.fn()
jest.mock('@/services/api/stores', () => ({ get: mockGet }))

import { createStore, throws, createValidationError } from '>/helpers'

const pickups = {
  actions: {
    setStoreFilter: jest.fn(),
  },
}

describe('stores module', () => {
  beforeEach(() => jest.resetModules())

  let store

  let store1, store2, store3
  beforeEach(() => {
    store = createStore({
      stores: require('./stores'),
      pickups,
    })
  })

  beforeEach(() => {
    store1 = { id: 1, name: 'store 1' }
    store2 = { id: 2, name: 'store 2' }
    store3 = { id: 3, name: 'store 3' }
  })

  beforeEach(() => {
    store.commit('stores/Receive Stores', { stores: [store1, store2, store3] })
  })

  it('throws routeError if store is not accessible', async () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(store.dispatch('stores/selectStore', { storeId: 9999 })).rejects.toHaveProperty('type', 'RouteError')
    expect(pickups.actions.setStoreFilter).not.toBeCalled()
  })
})
