import { createStore } from '>/helpers'

describe('map', () => {
  beforeEach(() => jest.resetModules())

  let store
  beforeEach(() => {
    store = createStore({
      map: require('./map').default,
    })
  })

  it('can toggle map stores', () => {
    expect(store.getters['map/showStores']).toBe(true)
    store.commit('map/toggleStores')
    expect(store.getters['map/showStores']).toBe(false)
    store.commit('map/toggleStores')
    expect(store.getters['map/showStores']).toBe(true)
  })

  it('can toggle map users', () => {
    expect(store.getters['map/showUsers']).toBe(false)
    store.commit('map/toggleUsers')
    expect(store.getters['map/showUsers']).toBe(true)
    store.commit('map/toggleUsers')
    expect(store.getters['map/showUsers']).toBe(false)
  })
})
