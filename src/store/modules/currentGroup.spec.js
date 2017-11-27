const mockGet = jest.fn()
const mockConversation = jest.fn()
jest.mock('@/services/api/groups', () => ({
  get: mockGet,
  conversation: mockConversation,
}))

import { createStore, createValidationError, throws } from '>/helpers'

function enrich (group) {
  return {
    ...group,
    membership: {},
    activeAgreement: undefined,
    awaitingAgreement: false,
    __unenriched: group,
  }
}

describe('currentGroup', () => {
  beforeEach(() => jest.resetModules())

  let store

  let userId = 5
  let group3

  beforeEach(() => {
    group3 = { id: 3, name: 'group 3', members: [userId] }
  })

  // Reusable store mocks

  const groups = {
    getters: {
      get: () => () => group3,
    },
  }

  const agreements = {
    getters: {
      get: () => () => {},
    },
  }

  const auth = {
    getters: {
      userId: () => userId,
    },
    actions: {
      update: jest.fn(),
    },
  }

  const pickups = {
    actions: {
      clear: jest.fn(),
      fetchListByGroupId: jest.fn(),
    },
  }

  const conversations = {
    actions: {
      setActive: jest.fn(),
    },
  }

  describe('getters', () => {
    beforeEach(() => {
      store = createStore({
        currentGroup: require('./currentGroup').default,
        agreements,
        auth,
      })
    })

    beforeEach(() => {
      store.commit('currentGroup/set', group3)
    })

    it('can get currentGroup Id', () => {
      expect(store.getters['currentGroup/id']).toBe(group3.id)
    })

    it('can get currentGroup', () => {
      expect(store.getters['currentGroup/value']).toEqual(enrich(group3))
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      store = createStore({
        currentGroup: require('./currentGroup').default,
        agreements,
        auth,
        pickups,
        conversations,
      })
    })

    it('can select a group', async () => {
      mockConversation.mockReturnValueOnce({ id: 66 })
      mockGet.mockReturnValueOnce(group3)
      await store.dispatch('currentGroup/select', { groupId: group3.id })
      expect(pickups.actions.clear).toBeCalled()
      expect(pickups.actions.fetchListByGroupId.mock.calls[0][1]).toBe(group3.id)
      expect(conversations.actions.setActive.mock.calls[0][1]).toEqual({ id: 66 })
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      store = createStore({
        currentGroup: require('./currentGroup').default,
        groups,
        agreements,
        auth,
        pickups,
        conversations,
      })
    })

    it('throws routeError if not group does not exist or user is not member of the group', async () => {
      mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
      await expect(store.dispatch('currentGroup/select', { groupId: 9999 }))
        .rejects.toHaveProperty('type', 'RouteError')
    })
  })
})
