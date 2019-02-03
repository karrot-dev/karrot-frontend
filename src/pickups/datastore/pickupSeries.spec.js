import { createDatastore } from '>/helpers'
import { pickupSeriesMock } from '>/mockdata'
import { makePlace, makePickupSeries } from '>/enrichedFactories'

describe('pickupSeries module', () => {
  beforeEach(() => jest.resetModules())

  describe('with vuex', () => {
    let datastore
    let series1 = pickupSeriesMock[0]

    beforeEach(() => {
      datastore = createDatastore({
        pickupSeries: require('./pickupSeries').default,
        pickups: { getters: { upcomingAndStarted: () => [] } },
        places: { getters: { get: () => () => null } },
      })
    })

    beforeEach(() => {
      datastore.commit('pickupSeries/set', [series1])
    })

    it('can update series', () => {
      const changed = { ...series1, description: 'new description' }
      datastore.commit('pickupSeries/update', [changed])
      expect(datastore.getters['pickupSeries/get'](changed.id).description).toEqual(changed.description)
    })

    it('can delete series', () => {
      datastore.commit('pickupSeries/delete', series1.id)
      expect(datastore.getters['pickupSeries/get'](series1.id)).toBeUndefined()
    })
  })

  it('filters by active place', () => {
    const activePlace = makePlace({ isActivePlace: true })
    const activeSeries = makePickupSeries({ place: activePlace })
    const inactivePlace = makePlace({ isActivePlace: false })
    const inactiveSeries = makePickupSeries({ place: inactivePlace })
    const { getters } = require('./pickupSeries').default
    const otherGetters = {
      all: [activeSeries, inactiveSeries],
    }

    const result = getters.byActivePlace(null, otherGetters)
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(activeSeries.id)
  })
})
