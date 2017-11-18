const mockGet = jest.fn()
const mockJoin = jest.fn()
const mockLeave = jest.fn()
const mockSave = jest.fn()
const mockConversation = jest.fn()
jest.mock('@/services/api/groups', () => ({
  get: mockGet,
  join: mockJoin,
  leave: mockLeave,
  save: mockSave,
  conversation: mockConversation,
}))

const mockFetchGroupsPreview = jest.fn()
jest.mock('@/services/api/groupsInfo', () => ({
  list: mockFetchGroupsPreview,
}))

const mockRouterPush = jest.fn()
const mockRouterReplace = jest.fn()
jest.mock('@/router', () => ({
  push: mockRouterPush,
  replace: mockRouterReplace,
}))

import { createStore, createValidationError, createNotFoundError, defaultActionStatusesFor, throws } from '>/helpers'

function enrich (group) {
  return {
    ...group,
    isMember: false,
    awaitingAgreement: false,
    activeAgreement: undefined,
    membership: {},
    ...defaultActionStatusesFor('save', 'join', 'leave'),
    __unenriched: group,
  }
}

function enrichAsMember (group) {
  return { ...enrich(group), isMember: true }
}

describe('groups', () => {
  beforeEach(() => jest.resetModules())

  let store

  let userId = 5
  let group1
  let group2
  let group3

  beforeEach(() => {
    group1 = { id: 1, name: 'group 1', members: [] }
    group2 = { id: 2, name: 'group 2', members: [userId] }
    group3 = { id: 3, name: 'group 3', members: [userId] }
  })

  // Reusable store mocks

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

  const alerts = {
    actions: {
      create: jest.fn(),
    },
  }

  const users = {
    getters: {
      get () {
        return id => ({ id, name: `Some Name${id}` })
      },
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

  const routeError = {
    actions: {
      set: jest.fn(),
    },
  }

  describe('logged out', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups'),
        agreements,
      })
    })

    it('can fetch the group list', async () => {
      mockFetchGroupsPreview.mockReturnValueOnce([group1])
      await store.dispatch('groups/fetchGroupsPreview')
      expect(store.getters['groups/all']).toEqual([enrich(group1)])
    })

    it('can not join a group', async () => {
      mockJoin.mockImplementationOnce(throws(Error('some error')))
      store.commit('groups/Receive Groups', { groups: [group1] })
      await expect(store.dispatch('groups/join', { id: group1.id })).rejects.toHaveProperty('message', 'some error')
    })
  })

  describe('logged in', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups'),
        auth,
        agreements,
        alerts,
      })
    })

    beforeEach(() => {
      store.commit('groups/Receive Groups', { groups: [group1, group2, group3] })
    })

    it('can fetch my group list', async () => {
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group2.id, group3.id])
    })

    it('can join a group', async () => {
      mockJoin.mockReturnValueOnce({})
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group2.id, group3.id])
      await store.dispatch('groups/join', { id: group1.id })
      expect(mockRouterPush).toBeCalledWith({ name: 'group', params: { groupId: group1.id } })
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group1.id, group2.id, group3.id])
    })

    it('can leave a group', async () => {
      mockLeave.mockReturnValueOnce({})
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group2.id, group3.id])
      await store.dispatch('groups/leave', group2.id)
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group3.id])
    })

    it('can save a group', async () => {
      mockSave.mockImplementationOnce(group => group)
      await store.dispatch('groups/save', { id: group2.id, name: 'new name' })
    })

    it('adds save errors to the group', async () => {
      const validationErrors = { foo: 'bar' }
      mockSave.mockImplementationOnce(throws(createValidationError(validationErrors)))
      await store.dispatch('groups/save', { id: group2.id, name: 'new name' })
      expect(store.getters['groups/get'](group2.id)).toEqual({
        ...enrichAsMember(group2),
        saveStatus: { pending: false, validationErrors: validationErrors },
      })
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups'),
        agreements,
        auth,
        users,
      })
    })

    beforeEach(() => {
      store.commit('groups/Receive Groups', { groups: [group1, group2, group3] })
      store.commit('groups/Set Active', { groupId: group2.id })
      store.commit('groups/Receive Group', { group: group2 })
    })

    it('can get a group', () => {
      expect(store.getters['groups/get'](group1.id)).toEqual(enrich(group1))
    })

    it('can get myGroups', () => {
      expect(store.getters['groups/myGroups']).toEqual([group2, group3].map(enrichAsMember))
    })

    it('can get otherGroups', () => {
      expect(store.getters['groups/otherGroups']).toEqual([group1].map(enrich))
    })

    it('can get activeGroupId', () => {
      expect(store.getters['groups/activeGroupId']).toBe(group2.id)
    })

    it('can get activeGroup', () => {
      expect(store.getters['groups/activeGroup']).toEqual(enrichAsMember(group2))
    })
  })

  describe('with lots of mock stuff', () => {
    beforeEach(() => {
      store.commit('groups/Receive Groups', { groups: [group1, group2, group3] })
    })

    beforeEach(() => {
      store = createStore({
        groups: require('./groups'),
        agreements,
        auth,
        pickups,
        conversations,
        routeError,
      })
    })

    it('can select a group', async () => {
      mockConversation.mockReturnValueOnce({ id: 66 })
      mockGet.mockReturnValueOnce(group2)
      await store.dispatch('groups/selectGroup', group2.id)
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([])
      expect(pickups.actions.clear).toBeCalled()
      expect(pickups.actions.fetchListByGroupId.mock.calls[0][1]).toBe(group2.id)
      expect(conversations.actions.setActive.mock.calls[0][1]).toEqual({ id: 66 })
      expect(routeError.actions.set).not.toBeCalled()
    })

    it('sets routeError if not member of group', async () => {
      mockGet.mockReturnValueOnce(group1)
      await store.dispatch('groups/selectGroup', group1.id)
      expect(routeError.actions.set).toBeCalled()
    })

    it('sets routeError if not group does not exist', async () => {
      mockGet.mockImplementationOnce(throws(createNotFoundError))
      await store.dispatch('groups/selectGroup', 9999)
      expect(routeError.actions.set).toBeCalled()
    })
  })

  describe('groupInfo', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups'),
        routeError,
      })
    })

    it('sets routeError if group does not exist', async () => {
      await store.dispatch('groups/selectGroupInfo', 9999)
      expect(routeError.actions.set).toBeCalled()
      expect(store.getters['groups/activeGroupInfo']).toBeUndefined()
    })
  })
})
