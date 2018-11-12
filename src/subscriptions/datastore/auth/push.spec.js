const mockGetToken = jest.fn()
const mockOnTokenRefresh = jest.fn()
const mockRequestPermission = jest.fn()
const mockInitializeMessaging = jest.fn(() => ({
  getToken: mockGetToken,
  onTokenRefresh: mockOnTokenRefresh,
  requestPermission: mockRequestPermission,
}))

const mockRemoveServiceWorkersOnUnload = jest.fn()

const mockListSubscriptions = jest.fn()
const mockCreateSubscription = jest.fn()
const mockDeleteSubscription = jest.fn()
jest.mock('@/subscriptions/api/subscriptions', () => ({
  list: mockListSubscriptions,
  create: mockCreateSubscription,
  delete: mockDeleteSubscription,
}))

jest.mock('@/subscriptions/firebase', () => ({
  initializeMessaging: mockInitializeMessaging,
  removeServiceWorkersOnUnload: mockRemoveServiceWorkersOnUnload,
}))
import { createDatastore, nextTicks } from '>/helpers'

describe('auth/push', () => {
  beforeEach(() => jest.resetModules())
  beforeEach(() => jest.clearAllMocks())

  describe('module', () => {
    let datastore
    beforeEach(() => {
      datastore = createDatastore({
        auth: {
          modules: {
            push: require('./push').default,
          },
        },
      })
    })

    it('can be enabled', async () => {
      const token = 'my token'
      mockGetToken.mockResolvedValueOnce(null)
      mockGetToken.mockResolvedValueOnce(token)
      await datastore.dispatch('auth/push/enable')
      expect(datastore.getters['auth/push/enabled']).toBe(true)
      expect(datastore.state.auth.push.token).toBe(token)
      expect(mockRequestPermission).toBeCalled()
    })

    it('does not enable if the user denies', async () => {
      const token = 'my token'
      mockGetToken.mockResolvedValueOnce(null)
      mockGetToken.mockResolvedValueOnce(token)
      mockRequestPermission.mockRejectedValueOnce({ code: 'messaging/permission-blocked' })
      await datastore.dispatch('auth/push/enable')
      expect(datastore.getters['auth/push/enabled']).toBe(false)
      expect(datastore.state.auth.push.token).toBe(null)
      expect(mockRequestPermission).toBeCalled()
    })
  })

  describe('plugin', () => {
    let datastore
    beforeEach(() => {
      datastore = createDatastore({
        auth: {
          getters: {
            isLoggedIn: () => true,
          },
          modules: {
            push: require('./push').default,
          },
        },
      }, {
        plugins: [require('./push').plugin],
      })
    })

    it('saves the token', async () => {
      mockListSubscriptions.mockResolvedValueOnce([])
      const token = 'my token to save'
      datastore.commit('auth/push/setToken', token)
      expect(datastore.state.auth.push.token).toBe(token)
      await nextTicks(2)
      expect(mockCreateSubscription).toBeCalled()
      expect(mockCreateSubscription.mock.calls[0][0]).toEqual({ platform: 'web', token: token })
    })

    it('deletes old tokens', async () => {
      const oldSubscription = {
        id: 242,
        token: 'my old token',
      }
      mockListSubscriptions.mockResolvedValue([oldSubscription])
      const token = 'my new token'
      datastore.commit('auth/push/setToken', oldSubscription.token)
      await nextTicks(1)
      datastore.commit('auth/push/setToken', token)
      expect(datastore.state.auth.push.token).toBe(token)
      await nextTicks(2)
      expect(mockDeleteSubscription).toBeCalled()
      expect(mockDeleteSubscription.mock.calls[0][0]).toEqual(oldSubscription.id)
    })
  })
})
