const mockFetchGroupsPreview = jest.fn()
const mockJoin = jest.fn()
const mockLeave = jest.fn()
const mockConversation = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/services/api/groups', () => ({
  join: mockJoin,
  leave: mockLeave,
  conversation: mockConversation,
}))
jest.mock('@/services/api/groupsInfo', () => ({
  list: mockFetchGroupsPreview,
}))
jest.mock('@/router', () => ({ push: mockRouterPush }))

import { createStore, throws } from '>/helpers'

function enrich (group) {
  return { ...group, isMember: false, awaitingAgreement: false, activeAgreement: undefined, membership: {} }
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
      mockJoin.mockImplementation(throws({ response: { status: 403, data: 'some error' } }))
      store.commit('groups/Receive Groups', { groups: [group1] })
      await store.dispatch('groups/join', { groupId: group1.id })
      expect(store.getters['groups/joinStatus']).toEqual({ error: 'some error', isWaiting: false })
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
      await store.dispatch('groups/join', { groupId: group1.id })
      expect(mockRouterPush).toBeCalledWith({ name: 'group', params: { groupId: group1.id } })
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group1.id, group2.id, group3.id])
    })

    it('can leave a group', async () => {
      mockLeave.mockReturnValueOnce({})
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group2.id, group3.id])
      await store.dispatch('groups/leave', group2.id)
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([group3.id])
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
      })
    })

    it('can select a group', async () => {
      mockConversation.mockReturnValueOnce({ id: 66 })
      await store.dispatch('groups/selectGroup', group2.id)
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([])
      expect(pickups.actions.clear).toBeCalled()
      expect(pickups.actions.fetchListByGroupId.mock.calls[0][1]).toBe(group2.id)
      expect(conversations.actions.setActive.mock.calls[0][1]).toEqual({ id: 66 })
    })
  })
})
