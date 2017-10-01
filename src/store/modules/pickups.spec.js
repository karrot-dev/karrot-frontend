jest.mock('@/services/api/pickups', () => ({
}))

import { createStore, throws } from '>/helpers'

describe('pickups', () => {
  beforeEach(() => jest.resetModules())

  let storeMocks
  let vstore

  let userId = 10
  let store = {
    id: 20,
  }

  let pickup1
  let pickup2
  let pickup3

  beforeEach(() => {
    pickup1 = { id: 1, store: store.id, collectorIds: [] }
    pickup2 = { id: 2, store: store.id, collectorIds: [userId] }
    pickup3 = { id: 3, store: store.id, collectorIds: [userId] }
  })

  describe('logged in', () => {
    beforeEach(() => {
      storeMocks = {
        auth: {
          getters: {
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
      vstore = createStore({
        pickups: require('./pickups'),
        ...storeMocks,
      })
    })

    beforeEach(() => {
      vstore.commit('pickups/Receive List', { pickups: [pickup1, pickup2, pickup3] })
    })

    it('can fetch list', async () => {
      // Currently only checking very basic way...
      // TODO: test the enriched version
      expect(vstore.getters['pickups/all'].map(pickup => pickup.id))
        .toEqual([pickup1, pickup2, pickup3].map(pickup => pickup.id))
    })
  })
})
