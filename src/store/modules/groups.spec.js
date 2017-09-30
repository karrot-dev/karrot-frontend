const mockFetchGroups = jest.fn()
const mockJoin = jest.fn()
const mockLeave = jest.fn()
const mockConversation = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/services/api/groups', () => ({
  list: mockFetchGroups,
  join: mockJoin,
  leave: mockLeave,
  conversation: mockConversation,
}))
jest.mock('@/router', () => ({ push: mockRouterPush }))

import { createStore, throws } from '>/helpers'

describe('groups', () => {
  beforeEach(() => jest.resetModules())

  let storeMocks
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

  describe('logged out', () => {
    beforeEach(() => {
      store = createStore({groups: require('./groups')})
    })

    it('can fetch the group list', async () => {
      mockFetchGroups.mockReturnValueOnce([group1])
      await store.dispatch('groups/fetchGroups')
      expect(store.getters['groups/list']).toEqual([{ ...group1, isMember: false }])
    })

    it('can not join a group', async () => {
      mockJoin.mockImplementation(throws('some error'))
      store.commit('groups/Receive Groups', { groups: [group1] })
      await store.dispatch('groups/join', { groupId: group1.id })
      expect(store.getters['groups/joinStatus']).toEqual({ error: 'some error', isWaiting: false })
    })
  })

  describe('logged in', () => {
    beforeEach(() => {
      storeMocks = {
        auth: {
          getters: {
            userId: () => userId,
          },
        },
      }
      store = createStore({
        groups: require('./groups'),
        ...storeMocks,
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
      storeMocks = {
        auth: {
          getters: {
            userId: () => userId,
          },
        },
      }
      store = createStore({
        groups: require('./groups'),
        ...storeMocks,
      })
    })

    beforeEach(() => {
      store.commit('groups/Receive Groups', { groups: [group1, group2, group3] })
      store.commit('groups/Set Active', { groupId: group2.id })
      store.commit('groups/Receive Group', { group: group2 })
    })

    it('has groups/myGroups', () => {
      expect(store.getters['groups/myGroups']).toEqual([group2, group3].map(g => {
        return { ...g, isMember: true }
      }))
    })

    it('has groups/activeGroupId', () => {
      expect(store.getters['groups/activeGroupId']).toBe(group2.id)
    })

    it('has groups/activeGroup', () => {
      expect(store.getters['groups/activeGroup']).toEqual({ ...group2, isMember: true })
    })
  })

  describe('with lots of mock stuff', () => {
    beforeEach(() => {
      store.commit('groups/Receive Groups', { groups: [group1, group2, group3] })
    })

    beforeEach(() => {
      storeMocks = {
        auth: {
          getters: {
            userId: () => userId,
          },
        },
        pickups: {
          actions: {
            clear: jest.fn(),
            fetchListByGroupId: jest.fn(),
          },
        },
        stores: {
          actions: {
            clear: jest.fn(),
            fetchListByGroupId: jest.fn(),
          },
        },
        conversations: {
          actions: {
            setActive: jest.fn(),
          },
        },
      }
      store = createStore({
        groups: require('./groups'),
        ...storeMocks,
      })
    })

    it('can select a group', async () => {
      mockConversation.mockReturnValueOnce({ id: 66 })
      await store.dispatch('groups/selectGroup', group2.id)
      expect(store.getters['groups/myGroups'].map(e => e.id)).toEqual([])
      expect(storeMocks.pickups.actions.clear).toBeCalled()
      expect(storeMocks.pickups.actions.fetchListByGroupId.mock.calls[0][1]).toBe(group2.id)
      expect(storeMocks.stores.actions.clear).toBeCalled()
      expect(storeMocks.stores.actions.fetchListByGroupId.mock.calls[0][1]).toBe(group2.id)
      expect(storeMocks.conversations.actions.setActive.mock.calls[0][1]).toEqual({ id: 66 })
    })
  })
})
