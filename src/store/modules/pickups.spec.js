const mockGet = jest.fn()
const mockJoin = jest.fn()
const mockLeave = jest.fn()
jest.mock('@/services/api/pickups', () => ({
  get: mockGet,
  join: mockJoin,
  leave: mockLeave,
}))

import { createStore, defaultActionStatusesFor } from '>/helpers'
import lolex from 'lolex'

describe('pickups', () => {
  beforeEach(() => jest.resetModules())

  let storeMocks
  let vstore
  let clock

  let userId = 10

  let pickup1
  let pickup2
  let pickup3
  const group = { id: 666, isCurrentGroup: true }

  beforeEach(() => {
    const now = new Date('2017-01-01T12:00:10Z')
    clock = lolex.install({ now, toFake: ['Date'] })
    pickup1 = { id: 1, store: 10, date: new Date(), collectorIds: [], group }
    pickup2 = { id: 2, store: 11, date: new Date(), collectorIds: [userId], maxCollectors: 1, group }
    pickup3 = { id: 3, store: 12, date: new Date(), collectorIds: [userId], group }
  })

  afterEach(() => {
    clock = clock.uninstall()
  })

  describe('logged in', () => {
    beforeEach(() => {
      storeMocks = {
        auth: {
          getters: {
            isLoggedIn: () => true,
            userId: () => userId,
          },
        },
        stores: {
          getters: {
            get () {
              return id => ({ id, group })
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
      vstore = createStore({
        pickups,
        ...storeMocks,
      })
    })

    beforeEach(() => {
      vstore.commit('pickups/set', [pickup1, pickup2, pickup3])
    })

    it('can enrich', async () => {
      expect(vstore.getters['pickups/enrich'](pickup2)).toEqual({
        ...pickup2,
        ...defaultActionStatusesFor('save', 'join', 'leave'),
        store: { id: pickup2.store, group },
        isUserMember: true,
        isEmpty: false,
        isFull: true,
        collectors: [{ id: userId, name: `Some Name${userId}` }],
      })
    })

    it('can fetch list', async () => {
      expect(vstore.getters['pickups/all'].map(getId)).toEqual([pickup1, pickup2, pickup3].map(getId))
    })

    it('can get available pickups', async () => {
      expect(vstore.getters['pickups/available'].map(getId)).toEqual([pickup1].map(getId))
    })

    it('can get my pickups', async () => {
      expect(vstore.getters['pickups/joined'].map(getId)).toEqual([pickup2, pickup3].map(getId))
    })

    it('can get filtered', async () => {
      vstore.commit('pickups/setStoreIdFilter', pickup2.store)
      expect(vstore.getters['pickups/filtered'].map(getId)).toEqual([pickup2].map(getId))
    })

    it('can fetch a pickup', async () => {
      let date = new Date()
      let pickupId = 99
      let storeId = 101
      mockGet.mockImplementationOnce(id => ({ id, date, store: storeId, collectorIds: [] }))
      await vstore.dispatch('pickups/fetch', pickupId)
      const pickup = vstore.getters['pickups/get'](pickupId)
      expect(pickup).toEqual({
        id: pickupId,
        collectorIds: [],
        collectors: [],
        date,
        isUserMember: false,
        isEmpty: true,
        isFull: false,
        ...defaultActionStatusesFor('save', 'join', 'leave'),
        store: {
          id: storeId,
          group,
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

    it('can set and clear store filter', () => {
      expect(vstore.getters['pickups/filtered'].map(getId)).toEqual([pickup1, pickup2, pickup3].map(getId))
      vstore.dispatch('pickups/setStoreFilter', pickup3.store)
      expect(vstore.getters['pickups/filtered'].map(getId)).toEqual([pickup3].map(getId))
      vstore.dispatch('pickups/clearStoreFilter')
      expect(vstore.getters['pickups/filtered'].map(getId)).toEqual([pickup1, pickup2, pickup3].map(getId))
    })

    it('can update a pickup', () => {
      const changed = { ...pickup1, maxCollectors: 987 }
      vstore.dispatch('pickups/update', changed)
      expect(vstore.getters['pickups/get'](changed.id).maxCollectors).toEqual(changed.maxCollectors)
    })

    it('can delete a pickup', () => {
      vstore.dispatch('pickups/delete', pickup1.id)
      expect(vstore.getters['pickups/get'](pickup1.id)).toBeUndefined()
    })

    it('can add possible feedback', () => {
      vstore.dispatch('pickups/addFeedbackPossible', pickup1)
      expect(vstore.getters['pickups/feedbackPossible'][0].date).toEqual(pickup1.date)
    })
  })
})

function getId ({ id }) {
  return id
}
