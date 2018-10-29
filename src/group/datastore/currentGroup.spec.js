const mockGet = jest.fn()
const mockConversation = jest.fn()
jest.mock('@/group/api/groups', () => ({
  get: mockGet,
  conversation: mockConversation,
}))

import { createStore, createValidationError, throws, statusMocks } from '>/helpers'

function enrichMemberships (memberships, users, currentUserId) {
  return Object.entries(memberships).reduce((obj, [uId, membership]) => {
    obj[uId] = {
      ...membership,
      isEditor: membership.roles.includes('editor'),
      trustProgress: membership.trustedBy.length / 3,
      trusted: membership.trustedBy.includes(currentUserId),
      trustThresholdForNewcomer: 3,
      trustUserStatus: statusMocks.default(),
    }
    return obj
  }, {})
}

function enrich (group, users, currentUserId) {
  const membership = group.memberships[currentUserId]
  return {
    ...group,
    membership: enrichMemberships({ [currentUserId]: membership }, users, currentUserId)[currentUserId],
    memberships: enrichMemberships(group.memberships, users, currentUserId),
    activeAgreement: undefined,
    awaitingAgreement: false,
    isPlayground: false,
  }
}

describe('currentGroup', () => {
  beforeEach(() => jest.resetModules())

  let store

  let userId
  let group3
  let users
  let getForGroup

  beforeEach(() => {
    userId = 5
    group3 = {
      id: 3,
      name: 'group 3',
      members: [userId, 6],
      trustThresholdForNewcomer: 3,
      memberships: {
        [userId]: {
          createdAt: new Date(),
          roles: [],
          trustedBy: [6],
        },
        6: {
          createdAt: new Date(),
          roles: [],
          trustedBy: [userId],
        },
      },
    }
    users = {
      [userId]: {
        id: userId,
      },
      6: {
        id: 6,
      },
    }
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
    actions: {
      fetchGroupConversation: jest.fn(),
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
        users: require('../../users/datastore/users').default,
        agreements,
        auth,
        conversations,
      })
    })

    beforeEach(() => {
      store.commit('currentGroup/set', group3)
      store.commit('users/update', [Object.values(users)])
    })

    it('can get currentGroup Id', () => {
      expect(store.getters['currentGroup/id']).toBe(group3.id)
    })

    it('can get currentGroup', () => {
      expect(store.getters['currentGroup/value']).toEqual(enrich(group3, users, userId))
    })

    it('can get the conversation for the current group', () => {
      const conversation = { id: 10 }
      getForGroup.mockReturnValueOnce(conversation)
      expect(store.getters['currentGroup/conversation']).toEqual(conversation)
      expect(getForGroup).toBeCalled()
      expect(getForGroup.mock.calls[0][0]).toEqual(group3.id)
    })

    it('can get memberships', () => {
      expect(store.getters['currentGroup/memberships']).toEqual(enrichMemberships(group3.memberships, users, userId))
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
        conversations,
      })
    })

    it('can select a group', async () => {
      mockConversation.mockReturnValueOnce({ id: 66 })
      mockGet.mockReturnValueOnce(group3)
      await store.dispatch('currentGroup/select', { groupId: group3.id })
      expect(pickups.actions.fetchListByGroupId.mock.calls[0][1]).toBe(group3.id)
      expect(pickups.actions.fetchFeedbackPossible.mock.calls[0][1]).toEqual(group3.id)
      expect(auth.actions.maybeBackgroundSave.mock.calls[0][1]).toEqual({ currentGroup: group3.id })
      expect(groupApplications.actions.fetchByGroupId).toBeCalled()
      expect(conversations.actions.fetchGroupConversation).toBeCalled()
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
      await expect(select).rejects.toHaveProperty('data', { name: 'groupPreview', params: { groupPreviewId: 9999 } })
    })
  })
})
