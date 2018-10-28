import { createStore } from '>/helpers'
import { pickupSeriesMock } from '>/mockdata'

describe('pickupSeries module', () => {
  beforeEach(() => jest.resetModules())
  let store
  let series1 = pickupSeriesMock[0]

  beforeEach(() => {
    store = createStore({
      pickupSeries: require('./pickupSeries').default,
      pickups: { getters: { all: () => [] } },
    })
  })

  beforeEach(() => {
    store.commit('pickupSeries/set', { list: [series1], storeId: series1.store })
  })

  it('can update series', () => {
    const changed = { ...series1, description: 'new description' }
    store.dispatch('pickupSeries/update', changed)
    expect(store.getters['pickupSeries/get'](changed.id).description).toEqual(changed.description)
  })

  it('can delete series', () => {
    store.dispatch('pickupSeries/delete', series1.id)
    expect(store.getters['pickupSeries/get'](series1.id)).toBeUndefined()
  })
})
