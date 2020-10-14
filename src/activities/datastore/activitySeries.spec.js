import { createDatastore } from '>/helpers'
import { activitySeriesMock } from '>/mockdata'
import { makePlace, makeActivitySeries } from '>/enrichedFactories'

describe('activitySeries module', () => {
  beforeEach(() => jest.resetModules())

  describe('with vuex', () => {
    let datastore
    const series1 = activitySeriesMock[0]

    beforeEach(() => {
      datastore = createDatastore({
        activitySeries: require('./activitySeries').default,
        activities: { getters: { upcomingAndStarted: () => [] } },
        activityTypes: { getters: { get: () => () => null }},
        places: { getters: { get: () => () => null } },
      })
    })

    beforeEach(() => {
      datastore.commit('activitySeries/set', [series1])
    })

    it('can update series', () => {
      const changed = { ...series1, description: 'new description' }
      datastore.commit('activitySeries/update', [changed])
      expect(datastore.getters['activitySeries/get'](changed.id).description).toEqual(changed.description)
    })

    it('can delete series', () => {
      datastore.commit('activitySeries/delete', series1.id)
      expect(datastore.getters['activitySeries/get'](series1.id)).toBeUndefined()
    })
  })

  it('filters by active place', () => {
    const activePlace = makePlace({ isActivePlace: true })
    const activeSeries = makeActivitySeries({ place: activePlace })
    const inactivePlace = makePlace({ isActivePlace: false })
    const inactiveSeries = makeActivitySeries({ place: inactivePlace })
    const { getters } = require('./activitySeries').default
    const otherGetters = {
      all: [activeSeries, inactiveSeries],
    }

    const result = getters.byActivePlace(null, otherGetters)
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(activeSeries.id)
  })
})
