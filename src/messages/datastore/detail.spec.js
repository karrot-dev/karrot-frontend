import { createDatastore, statusMocks } from '>/helpers'

describe('detail', () => {
  let datastore

  let mockConversationsGetForPickup = jest.fn()
  let mockPickupsGet = jest.fn()

  const conversations = {
    getters: {
      getForPickup: () => mockConversationsGetForPickup,
    },
  }

  const pickups = {
    getters: {
      get: () => mockPickupsGet,
    },
  }

  beforeEach(() => {
    jest.resetModules()
    const i18n = require('@/base/i18n').default
    i18n.locale = 'en'

    datastore = createDatastore({
      detail: require('./detail').default,
      conversations,
      pickups,
    })
  })

  describe('getters', () => {
    it('is inactive by default', () => {
      expect(datastore.getters['detail/isActive']).toBe(false)
    })

    it('is active if it has a pickupId', () => {
      datastore.commit('detail/setPickupId', 10)
      mockConversationsGetForPickup.mockReturnValueOnce({ id: 55, fetchStatus: statusMocks.default() })
      expect(datastore.getters['detail/isActive']).toBe(true)
    })

    it('is has the full pickup', () => {
      const pickup = { id: 22 }
      mockPickupsGet.mockReturnValueOnce(pickup)
      datastore.commit('detail/setPickupId', pickup.id)
      expect(datastore.getters['detail/pickup']).toBe(pickup)
      expect(mockPickupsGet).toBeCalled()
      expect(mockPickupsGet.mock.calls[0][0]).toEqual(pickup.id)
    })

    it('is has the full conversation', () => {
      const pickupId = 10
      const conversation = { id: 55 }
      mockConversationsGetForPickup.mockReturnValueOnce(conversation)
      datastore.commit('detail/setPickupId', pickupId)
      expect(datastore.getters['detail/conversation']).toBe(conversation)
      expect(mockConversationsGetForPickup).toBeCalled()
      expect(mockConversationsGetForPickup.mock.calls[0][0]).toEqual(pickupId)
    })
  })
})
