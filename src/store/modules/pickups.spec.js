const mockGet = jest.fn()
const mockJoin = jest.fn()
const mockLeave = jest.fn()
jest.mock('@/services/api/pickups', () => ({
  get: mockGet,
  join: mockJoin,
  leave: mockLeave,
}))

import { createStore } from '>/helpers'

describe('pickups', () => {
  beforeEach(() => jest.resetModules())

  let storeMocks
  let vstore
  let type

  let userId = 10

  let pickup1
  let pickup2
  let pickup3

  beforeEach(() => {
    pickup1 = { id: 1, store: 10, date: new Date(), collectorIds: [] }
    pickup2 = { id: 2, store: 11, date: new Date(), collectorIds: [userId] }
    pickup3 = { id: 3, store: 12, date: new Date(), collectorIds: [userId] }
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
              return id => ({ id })
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
      let pickups = require('./pickups')
      type = name => `pickups/${pickups.types[name]}`
      vstore = createStore({
        pickups,
        ...storeMocks,
      })
    })

    beforeEach(() => {
      vstore.commit(type('RECEIVE_LIST'), { pickups: [pickup1, pickup2, pickup3] })
    })

    it('can enrich', async () => {
      expect(vstore.getters['pickups/enrich'](pickup2)).toEqual({
        ...pickup2,
        store: { id: pickup2.store },
        isUserMember: true,
        isWaiting: false,
        collectors: [{ id: userId, name: `Some Name${userId}` }],
      })
    })

    it('can fetch list', async () => {
      expect(vstore.getters['pickups/all'].map(getId)).toEqual([pickup1, pickup2, pickup3].map(getId))
    })

    it('can get empty pickups', async () => {
      expect(vstore.getters['pickups/empty'].map(getId)).toEqual([pickup1].map(getId))
    })

    it('can get my pickups', async () => {
      expect(vstore.getters['pickups/mine'].map(getId)).toEqual([pickup2, pickup3].map(getId))
    })

    it('can get filtered', async () => {
      vstore.commit(type('SET_STORE_ID_FILTER'), { storeId: pickup2.store })
      expect(vstore.getters['pickups/filtered'].map(getId)).toEqual([pickup2].map(getId))
    })

    it('can fetch a pickup', async () => {
      let date = new Date()
      let pickupId = 99
      let storeId = 101
      mockGet.mockImplementationOnce(id => ({ id, date, store: storeId, collectorIds: [] }))
      await vstore.dispatch('pickups/fetch', pickupId)
      expect(vstore.getters['pickups/get'](pickupId)).toEqual({
        id: pickupId,
        collectorIds: [],
        collectors: [],
        date,
        isUserMember: false,
        isWaiting: false,
        store: {
          id: storeId,
        },
      })
    })

    it('can join a pickup', async () => {
      expect(vstore.getters['pickups/mine'].map(getId)).not.toContain(pickup1.id)
      await vstore.dispatch('pickups/join', pickup1.id)
      expect(vstore.getters['pickups/mine'].map(getId)).toContain(pickup1.id)
      expect(mockJoin).toBeCalledWith(pickup1.id)
    })

    it('can leave a pickup', async () => {
      expect(vstore.getters['pickups/mine'].map(getId)).toContain(pickup2.id)
      await vstore.dispatch('pickups/leave', pickup2.id)
      expect(vstore.getters['pickups/mine'].map(getId)).not.toContain(pickup2.id)
      expect(mockLeave).toBeCalledWith(pickup2.id)
    })
  })
})

function getId ({ id }) {
  return id
}

