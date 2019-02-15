const mockGet = jest.fn()
const mockJoin = jest.fn()
const mockLeave = jest.fn()
jest.mock('@/pickups/api/pickups', () => ({
  get: mockGet,
  join: mockJoin,
  leave: mockLeave,
}))

import { createDatastore, defaultActionStatusesFor } from '>/helpers'
import { makeGroup, makePlace, makePickup } from '>/enrichedFactories'
import lolex from 'lolex'
import addSeconds from 'date-fns/add_seconds'
import subSeconds from 'date-fns/sub_seconds'

describe('pickups', () => {
  beforeEach(() => jest.resetModules())

  describe('with vuex', () => {
    let datastoreMocks
    let vstore
    let clock

    let userId = 10

    let pickup1
    let pickup2
    let pickup3
    let pastPickup1
    let pastPickup2
    let startedPickup1
    let startedPickup2
    const group = { id: 666, isCurrentGroup: true }

    function dates (val, duration = 1800) {
      const date = new Date(val)
      const dateEnd = addSeconds(date, duration)
      return { date, dateEnd }
    }

    beforeEach(() => {
      const now = new Date('2017-01-01T12:00:10Z')
      clock = lolex.install({ now, toFake: ['Date'] })
      pickup1 = { id: 1, place: 10, collectors: [], group, ...dates('2017-01-01T13:00:10Z') }
      pickup2 = { id: 2, place: 11, collectors: [userId], maxCollectors: 1, group, ...dates('2017-01-01T13:00:10Z') }
      pickup3 = { id: 3, place: 12, collectors: [userId], group, ...dates('2017-01-01T13:00:10Z') }
      pastPickup1 = { id: 4, place: 13, collectors: [], group, ...dates('2017-01-01T09:00:10Z') }
      pastPickup2 = { id: 4, place: 13, collectors: [], group, ...dates('2017-01-01T10:00:10Z') }
      startedPickup1 = { id: 5, place: 13, collectors: [userId], group, ...dates('2017-01-01T09:00:10Z', 28800) }
      startedPickup2 = { id: 6, place: 13, collectors: [], group, ...dates('2017-01-01T11:50:10Z') }
    })

    afterEach(() => {
      clock = clock.uninstall()
    })

    beforeEach(() => {
      datastoreMocks = {
        auth: {
          getters: {
            isLoggedIn: () => true,
            userId: () => userId,
          },
        },
        places: {
          getters: {
            get () {
              return id => ({ id, group, isSubscribed: true })
            },
          },
        },
        users: {
          getters: {
            get () {
              return id => ({ id, name: `Some Name${id}` })
            },
          },
        },
      }
      let pickups = require('./pickups').default
      vstore = createDatastore({
        pickups,
        ...datastoreMocks,
      })
    })

    beforeEach(() => {
      vstore.commit('pickups/update', [pickup1, pickup2, pickup3, pastPickup1, pastPickup2, startedPickup1, startedPickup2])
    })

    it('can enrich', async () => {
      expect(vstore.getters['pickups/enrich'](pickup2)).toEqual({
        ...pickup2,
        ...defaultActionStatusesFor('save', 'join', 'leave'),
        place: { id: pickup2.place, group, isSubscribed: true },
        isUserMember: true,
        isEmpty: false,
        isFull: true,
        collectors: [{ id: userId, name: `Some Name${userId}` }],
        feedbackGivenBy: [],
        hasStarted: false,
      })
    })

    it('can get available pickups', async () => {
      expect(vstore.getters['pickups/available'].map(getId)).toEqual([pickup1].map(getId))
    })

    it('can get my pickups', async () => {
      expect(vstore.getters['pickups/joined'].map(getId)).toEqual([startedPickup1, pickup2, pickup3].map(getId))
    })

    it('can fetch a pickup', async () => {
      let date = subSeconds(new Date(), 60)
      let dateEnd = addSeconds(date, 1800)
      let pickupId = 99
      let placeId = 101
      mockGet.mockImplementationOnce(id => ({ id, date, dateEnd, place: placeId, collectors: [] }))
      await vstore.dispatch('pickups/fetch', pickupId)
      const pickup = vstore.getters['pickups/get'](pickupId)
      expect(pickup).toEqual({
        id: pickupId,
        collectors: [],
        feedbackGivenBy: [],
        date,
        dateEnd,
        isUserMember: false,
        isEmpty: true,
        isFull: false,
        hasStarted: true,
        ...defaultActionStatusesFor('save', 'join', 'leave'),
        place: {
          id: placeId,
          group,
          isSubscribed: true,
        },
        group,
      })
    })

    it('can join a pickup', async () => {
      expect(vstore.getters['pickups/joined'].map(getId)).not.toContain(pickup1.id)
      await vstore.dispatch('pickups/join', pickup1.id)
      expect(vstore.getters['pickups/joined'].map(getId)).toContain(pickup1.id)
      expect(mockJoin).toBeCalledWith(pickup1.id)
    })

    it('can leave a pickup', async () => {
      expect(vstore.getters['pickups/joined'].map(getId)).toContain(pickup2.id)
      await vstore.dispatch('pickups/leave', pickup2.id)
      expect(vstore.getters['pickups/joined'].map(getId)).not.toContain(pickup2.id)
      expect(mockLeave).toBeCalledWith(pickup2.id)
    })

    it('can update a pickup', () => {
      const changed = { ...pickup1, maxCollectors: 987 }
      vstore.commit('pickups/update', [changed])
      expect(vstore.getters['pickups/get'](changed.id).maxCollectors).toEqual(changed.maxCollectors)
    })

    it('can delete a pickup', () => {
      vstore.commit('pickups/delete', pickup1.id)
      expect(vstore.getters['pickups/get'](pickup1.id)).toBeUndefined()
    })

    it('can get upcoming and started', () => {
      expect(vstore.getters['pickups/upcomingAndStarted'].map(getId)).toEqual([startedPickup1, pickup1, pickup2, pickup3].map(getId))
    })

    it('gets started pickups if I am a collector', () => {
      expect(vstore.getters['pickups/upcomingAndStarted'].filter(p => p.hasStarted).map(getId)).toEqual([startedPickup1].map(getId))
    })
  })

  it('filters by active place', () => {
    const activePickup = makePickup({
      place: makePlace({ isActivePlace: true }),
    })
    const inactivePickup = makePickup({
      place: makePlace({ isActivePlace: false }),
    })
    const otherGetters = {
      byCurrentGroup: [activePickup, inactivePickup],
    }
    const { getters } = require('./pickups').default

    const result = getters.byActivePlace(null, otherGetters)
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(activePickup.id)
  })

  it('filters by current group', () => {
    const activePickup = makePickup({
      group: makeGroup({ isCurrentGroup: true }),
    })
    const inactivePickup = makePickup({
      group: makeGroup({ isCurrentGroup: false }),
    })
    const otherGetters = {
      upcomingAndStarted: [activePickup, inactivePickup],
    }
    const { getters } = require('./pickups').default

    const result = getters.byCurrentGroup(null, otherGetters)
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(activePickup.id)
  })
})

function getId ({ id }) {
  return id
}
