const mockJoin = jest.fn()
const mockLeave = jest.fn()
const mockSave = jest.fn()
jest.mock('@/group/api/groups', () => ({
  join: mockJoin,
  leave: mockLeave,
  save: mockSave,
}))

const mockFetchGroupsPreview = jest.fn()
jest.mock('@/groupInfo/api/groupsInfo', () => ({
  list: mockFetchGroupsPreview,
}))

const mockRouterPush = jest.fn()
const mockRouterReplace = jest.fn()
jest.mock('@/base/router', () => ({
  push: mockRouterPush,
  replace: mockRouterReplace,
}))

import { createStore, createValidationError, throws, statusMocks } from '>/helpers'
import { enrichGroup } from '>/storeHelpers'

function enrichAsMember (group) {
  return { ...enrichGroup(group), isMember: true }
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
      maybeBackgroundSave: jest.fn(),
    },
  }

  const banners = {
    actions: {
      create: jest.fn(),
    },
  }

  const toasts = {
    actions: {
      show: jest.fn(),
    },
  }

  const users = {
    getters: {
      get () {
        return id => ({ id, name: `Some Name${id}` })
      },
    },
  }

  const currentGroup = {
    actions: {
      update: jest.fn(),
      clear: jest.fn(),
    },
  }

  describe('logged out', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups').default,
        agreements,
      })
    })

    it('can fetch the group list', async () => {
      mockFetchGroupsPreview.mockReturnValueOnce([group1])
      await store.dispatch('groups/fetch')
      expect(store.getters['groups/all']).toEqual([enrichGroup(group1)])
    })

    it('can not join a group', async () => {
      mockJoin.mockImplementationOnce(throws(new Error('some error')))
      store.commit('groups/set', [group1])
      await expect(store.dispatch('groups/join', group1.id)).rejects.toHaveProperty('message', 'some error')
    })
  })

  describe('logged in', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups').default,
        auth,
        agreements,
        banners,
        currentGroup,
        toasts,
      })
    })

    beforeEach(() => {
      store.commit('groups/set', [group1, group2, group3])
    })

    it('can fetch my group list', async () => {
      expect(store.getters['groups/mine'].map(e => e.id)).toEqual([group2.id, group3.id])
    })

    it('can join a group', async () => {
      mockJoin.mockReturnValueOnce({})
      expect(store.getters['groups/mine'].map(e => e.id)).toEqual([group2.id, group3.id])
      await store.dispatch('groups/join', group1.id)
      expect(mockRouterPush).toBeCalledWith({ name: 'group', params: { groupId: group1.id } })
      expect(store.getters['groups/mine'].map(e => e.id)).toEqual([group1.id, group2.id, group3.id])
    })

    it('can leave a group', async () => {
      mockLeave.mockReturnValueOnce({})
      expect(store.getters['groups/mine'].map(e => e.id)).toEqual([group2.id, group3.id])
      await store.dispatch('groups/leave', group2.id)
      expect(store.getters['groups/mine'].map(e => e.id)).toEqual([group3.id])
      expect(auth.actions.maybeBackgroundSave).toBeCalled()
      expect(auth.actions.maybeBackgroundSave.mock.calls[0][1]).toEqual({ currentGroup: null })
      expect(currentGroup.actions.clear).toBeCalled()
      expect(toasts.actions.show).toBeCalled()
    })

    it('can save a group', async () => {
      mockSave.mockImplementationOnce(group => group)
      await store.dispatch('groups/save', { id: group2.id, name: 'new name' })
    })

    it('adds save errors to the group', async () => {
      const validationErrors = { foo: ['bar'] }
      mockSave.mockImplementationOnce(throws(createValidationError(validationErrors)))
      await store.dispatch('groups/save', { id: group2.id, name: 'new name' })
      expect(store.getters['groups/get'](group2.id)).toEqual({
        ...enrichAsMember(group2),
        saveStatus: statusMocks.validationError('foo', 'bar'),
      })
    })

    it('can update a group', async () => {
      const changed = { ...group1, name: 'new name' }
      store.commit('groups/update', [changed])
      expect(store.getters['groups/get'](changed.id).name).toEqual(changed.name)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups').default,
        agreements,
        auth,
        users,
      })
    })

    beforeEach(() => {
      store.commit('groups/set', [group1, group2, group3])
    })

    it('can get a group', () => {
      expect(store.getters['groups/get'](group1.id)).toEqual(enrichGroup(group1))
    })

    it('can get myGroups', () => {
      expect(store.getters['groups/mine']).toEqual([group2, group3].map(enrichAsMember))
    })

    it('can get otherGroups', () => {
      expect(store.getters['groups/other']).toEqual([group1].map(enrichGroup))
    })
  })

  describe('groupPreview', () => {
    beforeEach(() => {
      store = createStore({
        groups: require('./groups').default,
      })
    })

    it('throws routeError if group does not exist', async () => {
      const select = store.dispatch('groups/selectPreview', { groupPreviewId: 9999 })
      await expect(select).rejects.toHaveProperty('type', 'RouteError')
      await expect(select).rejects.toHaveProperty(['data', 'translation'], 'NOT_FOUND.EXPLANATION')
      expect(store.getters['groups/activePreview']).toBeUndefined()
    })
  })
})
