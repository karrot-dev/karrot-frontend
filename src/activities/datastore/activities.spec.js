const mockGet = jest.fn()
const mockJoin = jest.fn()
const mockLeave = jest.fn()
jest.mock('@/activities/api/activities', () => ({
  get: mockGet,
  join: mockJoin,
  leave: mockLeave,
}))

import { createDatastore, defaultActionStatusesFor } from '>/helpers'
import { makeGroup, makePlace, makeActivity, activityTypes } from '>/enrichedFactories'
import lolex from 'lolex'
import addSeconds from 'date-fns/addSeconds'
import subSeconds from 'date-fns/subSeconds'

describe('activities', () => {
  beforeEach(() => jest.resetModules())

  describe('with vuex', () => {
    let datastoreMocks
    let vstore
    let clock

    const userId = 10

    let activity1
    let activity2
    let activity3
    let pastActivity1
    let pastActivity2
    let startedActivity1
    let startedActivity2
    const group = { id: 666, isCurrentGroup: true }

    function dates (val, duration = 1800) {
      const date = new Date(val)
      const dateEnd = addSeconds(date, duration)
      return { date, dateEnd }
    }

    beforeEach(() => {
      const now = new Date('2017-01-01T12:00:10Z')
      clock = lolex.install({ now, toFake: ['Date'] })
      const activityType = activityTypes.pickup.id
      activity1 = { id: 1, activityType, place: 10, participants: [], group, ...dates('2017-01-01T13:00:10Z') }
      activity2 = { id: 2, activityType, place: 11, participants: [userId], maxParticipants: 1, group, ...dates('2017-01-01T13:00:10Z') }
      activity3 = { id: 3, activityType, place: 12, participants: [userId], group, ...dates('2017-01-01T13:00:10Z') }
      pastActivity1 = { id: 4, activityType, place: 13, participants: [], group, ...dates('2017-01-01T09:00:10Z') }
      pastActivity2 = { id: 4, activityType, place: 13, participants: [], group, ...dates('2017-01-01T10:00:10Z') }
      startedActivity1 = { id: 5, activityType, place: 13, participants: [userId], group, ...dates('2017-01-01T09:00:10Z', 28800) }
      startedActivity2 = { id: 6, activityType, place: 13, participants: [], group, ...dates('2017-01-01T11:50:10Z') }
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
      const activities = require('./activities').default
      const activityTypes = require('./activityTypes').default
      vstore = createDatastore({
        activities,
        activityTypes,
        ...datastoreMocks,
      })
    })

    beforeEach(() => {
      vstore.commit('activities/update', [activity1, activity2, activity3, pastActivity1, pastActivity2, startedActivity1, startedActivity2])
      vstore.commit('activityTypes/update', Object.values(activityTypes))
    })

    it('can enrich', async () => {
      expect(vstore.getters['activities/enrich'](activity2)).toEqual({
        ...activity2,
        ...defaultActionStatusesFor('save', 'join', 'leave'),
        place: { id: activity2.place, group, isSubscribed: true },
        isUserMember: true,
        isEmpty: false,
        isFull: true,
        activityType: {
          ...activityTypes.pickup,
          colorName: `activity-type-${activityTypes.pickup.id}`,
          iconProps: {
            name: activityTypes.pickup.icon,
            color: `activity-type-${activityTypes.pickup.id}`,
            title: activityTypes.pickup.name,
          },
          feedbackIconProps: {
            name: activityTypes.pickup.feedbackIcon,
            color: `activity-type-${activityTypes.pickup.id}`,
            title: activityTypes.pickup.name,
          },
        },
        participants: [{ id: userId, name: `Some Name${userId}` }],
        feedbackGivenBy: [],
        hasStarted: false,
      })
    })

    it('can get available activities', async () => {
      expect(vstore.getters['activities/available'].map(getId)).toEqual([activity1].map(getId))
    })

    it('can get my activities', async () => {
      expect(vstore.getters['activities/joined'].map(getId)).toEqual([startedActivity1, activity2, activity3].map(getId))
    })

    it('can fetch a activity', async () => {
      const date = subSeconds(new Date(), 60)
      const dateEnd = addSeconds(date, 1800)
      const activityId = 99
      const placeId = 101
      mockGet.mockImplementationOnce(id => ({ id, date, dateEnd, place: placeId, participants: [] }))
      await vstore.dispatch('activities/fetch', activityId)
      const activity = vstore.getters['activities/get'](activityId)
      expect(activity).toEqual({
        id: activityId,
        participants: [],
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

    it('can join a activity', async () => {
      expect(vstore.getters['activities/joined'].map(getId)).not.toContain(activity1.id)
      await vstore.dispatch('activities/join', activity1.id)
      expect(mockJoin).toBeCalledWith(activity1.id)
    })

    it('can leave a activity', async () => {
      expect(vstore.getters['activities/joined'].map(getId)).toContain(activity2.id)
      await vstore.dispatch('activities/leave', activity2.id)
      expect(mockLeave).toBeCalledWith(activity2.id)
    })

    it('can update a activity', () => {
      const changed = { ...activity1, maxParticipants: 987 }
      vstore.commit('activities/update', [changed])
      expect(vstore.getters['activities/get'](changed.id).maxParticipants).toEqual(changed.maxParticipants)
    })

    it('can delete a activity', () => {
      vstore.commit('activities/delete', activity1.id)
      expect(vstore.getters['activities/get'](activity1.id)).toBeUndefined()
    })

    it('can get upcoming and started', () => {
      expect(vstore.getters['activities/upcomingAndStarted'].map(getId)).toEqual([startedActivity1, startedActivity2, activity1, activity2, activity3].map(getId))
    })
  })

  it('filters by active place', () => {
    const activeActivity = makeActivity({
      place: makePlace({ isActivePlace: true }),
    })
    const inactiveActivity = makeActivity({
      place: makePlace({ isActivePlace: false }),
    })
    const otherGetters = {
      byCurrentGroup: [activeActivity, inactiveActivity],
    }
    const { getters } = require('./activities').default

    const result = getters.byActivePlace(null, otherGetters)
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(activeActivity.id)
  })

  it('filters by current group', () => {
    const activeActivity = makeActivity({
      group: makeGroup({ isCurrentGroup: true }),
    })
    const inactiveActivity = makeActivity({
      group: makeGroup({ isCurrentGroup: false }),
    })
    const otherGetters = {
      upcomingAndStarted: [activeActivity, inactiveActivity],
    }
    const { getters } = require('./activities').default

    const result = getters.byCurrentGroup(null, otherGetters)
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(activeActivity.id)
  })
})

function getId ({ id }) {
  return id
}
