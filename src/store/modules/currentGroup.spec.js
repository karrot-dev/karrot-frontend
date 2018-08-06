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
    isPlayground: false,
  }
}

describe('currentGroup', () => {
  beforeEach(() => jest.resetModules())

  let store

  let userId = 5
  let group3
  let getForGroup

  beforeEach(() => {
    group3 = { id: 3, name: 'group 3', members: [userId] }
    getForGroup = jest.fn()
  })

  // Reusable store mocks

  const groups = {
    getters: {
      get: () => id => id === 3 ? group3 : undefined,
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
      maybeBackgroundSave: jest.fn(),
    },
  }

  const pickups = {
    actions: {
      clear: jest.fn(),
      fetchListByGroupId: jest.fn(),
      fetchFeedbackPossible: jest.fn(),
    },
  }

  const conversations = {
    getters: {
      getForGroup: () => getForGroup,
    },
  }

  const groupApplications = {
    actions: {
      fetchByGroupId: jest.fn(),
    },
  }

  describe('getters', () => {
    beforeEach(() => {
      store = createStore({
        currentGroup: require('./currentGroup').default,
        agreements,
        auth,
        conversations,
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

    it('can get the conversation for the current group', () => {
      const conversation = { id: 10 }
      getForGroup.mockReturnValueOnce(conversation)
      expect(store.getters['currentGroup/conversation']).toEqual(conversation)
      expect(getForGroup).toBeCalled()
      expect(getForGroup.mock.calls[0][0]).toEqual(group3.id)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      store = createStore({
        currentGroup: require('./currentGroup').default,
        agreements,
        auth,
        pickups,
        groupApplications,
      })
    })

    it('can select a group', async () => {
      mockConversation.mockReturnValueOnce({ id: 66 })
      mockGet.mockReturnValueOnce(group3)
      await store.dispatch('currentGroup/select', { groupId: group3.id })
      expect(pickups.actions.clear).toBeCalled()
      expect(pickups.actions.fetchListByGroupId.mock.calls[0][1]).toBe(group3.id)
      expect(pickups.actions.fetchFeedbackPossible.mock.calls[0][1]).toEqual(group3.id)
      expect(auth.actions.maybeBackgroundSave.mock.calls[0][1]).toEqual({ currentGroup: group3.id })
      expect(groupApplications.actions.fetchByGroupId).toBeCalled()
    })

    it('can update a group', async () => {
      mockConversation.mockReturnValueOnce({ id: 66 })
      mockGet.mockReturnValueOnce(group3)
      await store.dispatch('currentGroup/select', { groupId: group3.id })
      const changed = { ...group3, name: 'new name' }
      store.dispatch('currentGroup/update', changed)
      expect(store.getters['currentGroup/value'].name).toEqual(changed.name)
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
        groupApplications,
      })
    })

    it('throws routeRedirect if not group does not exist or user is not member of the group', async () => {
      mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
      const select = store.dispatch('currentGroup/select', { groupId: 9999 })
      await expect(select).rejects.toHaveProperty('type', 'RouteRedirect')
      await expect(select).rejects.toHaveProperty('data', { name: 'groupPreview', params: {groupPreviewId: 9999} })
    })
  })
})
