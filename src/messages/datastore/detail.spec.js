import { createDatastore, statusMocks } from '>/helpers'

describe('detail', () => {
  let datastore

  const mockConversationsGetForActivity = jest.fn()
  const mockActivitiesGet = jest.fn()

  const conversations = {
    getters: {
      getForActivity: () => mockConversationsGetForActivity,
    },
  }

  const activities = {
    getters: {
      get: () => mockActivitiesGet,
    },
  }

  beforeEach(() => {
    jest.resetModules()
    const i18n = require('@/base/i18n').default
    i18n.locale = 'en'

    datastore = createDatastore({
      detail: require('./detail').default,
      conversations,
      activities,
    })
  })

  describe('getters', () => {
    it('is inactive by default', () => {
      expect(datastore.getters['detail/isActive']).toBe(false)
    })

    it('is active if it has a activityId', () => {
      datastore.commit('detail/setActivityId', 10)
      mockConversationsGetForActivity.mockReturnValueOnce({ id: 55, fetchStatus: statusMocks.default() })
      expect(datastore.getters['detail/isActive']).toBe(true)
    })

    it('is has the full activity', () => {
      const activity = { id: 22 }
      mockActivitiesGet.mockReturnValueOnce(activity)
      datastore.commit('detail/setActivityId', activity.id)
      expect(datastore.getters['detail/activity']).toBe(activity)
      expect(mockActivitiesGet).toBeCalled()
      expect(mockActivitiesGet.mock.calls[0][0]).toEqual(activity.id)
    })

    it('is has the full conversation', () => {
      const activityId = 10
      const conversation = { id: 55 }
      mockConversationsGetForActivity.mockReturnValueOnce(conversation)
      datastore.commit('detail/setActivityId', activityId)
      expect(datastore.getters['detail/conversation']).toBe(conversation)
      expect(mockConversationsGetForActivity).toBeCalled()
      expect(mockConversationsGetForActivity.mock.calls[0][0]).toEqual(activityId)
    })
  })
})
