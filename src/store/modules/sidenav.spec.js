import { createStore } from '>/helpers'

describe('sidenav', () => {
  beforeEach(() => jest.resetModules())

  let storeMocks
  let store
  beforeEach(() => {
    storeMocks = {}
    store = createStore({
      sidenav: require('./sidenav'),
      ...storeMocks,
    })
  })

  it('can toggle map stores', () => {
    expect(store.getters['sidenav/showMapStores']).toBe(true)
    store.dispatch('sidenav/toggleMapStores')
    expect(store.getters['sidenav/showMapStores']).toBe(false)
    store.dispatch('sidenav/toggleMapStores')
    expect(store.getters['sidenav/showMapStores']).toBe(true)
  })

  it('can toggle map users', () => {
    expect(store.getters['sidenav/showMapUsers']).toBe(true)
    store.dispatch('sidenav/toggleMapUsers')
    expect(store.getters['sidenav/showMapUsers']).toBe(false)
    store.dispatch('sidenav/toggleMapUsers')
    expect(store.getters['sidenav/showMapUsers']).toBe(true)
  })
})
