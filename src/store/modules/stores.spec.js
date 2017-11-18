const mockGet = jest.fn()
jest.mock('@/services/api/stores', () => ({ get: mockGet }))

import { createStore, throws } from '>/helpers'

const pickups = {
  actions: {
    setStoreFilter: jest.fn(),
  },
}

const routeError = {
  actions: {
    set: jest.fn(),
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
      routeError,
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

  it('sets routeError if store is not accessible', () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    store.dispatch('stores/selectStore', 9999)
    expect(routeError.actions.set).toBeCalled()
    expect(pickups.actions.setStoreFilter).not.toBeCalled()
  })
})
