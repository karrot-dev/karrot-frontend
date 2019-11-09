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

const routerMocks = require('>/routerMocks').default
const mockRouterPush = jest.fn(routerMocks.$router.push)
const mockRouterReplace = jest.fn(routerMocks.$router.replace)
jest.mock('@/base/router', () => ({
  push: mockRouterPush,
  replace: mockRouterReplace,
}))

import { createDatastore, createValidationError, throws, statusMocks } from '>/helpers'
import { enrichGroup } from '>/datastoreHelpers'

function enrichAsMember (group) {
  return { ...enrichGroup(group), isMember: true }
}

describe('groups', () => {
  beforeEach(() => jest.resetModules())

  let datastore

  const userId = 5
  let group1
  let group2
  let group3

  beforeEach(() => {
    group1 = { id: 1, name: 'group 1', members: [] }
    group2 = { id: 2, name: 'group 2', members: [userId] }
    group3 = { id: 3, name: 'group 3', members: [userId] }
  })

  // Reusable datastore mocks
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
      maybeUpdate: jest.fn(),
      clear: jest.fn(),
    },
  }

  describe('logged out', () => {
    beforeEach(() => {
      datastore = createDatastore({
        groups: require('./groups').default,
      })
    })

    it('can fetch the group list', async () => {
      mockFetchGroupsPreview.mockReturnValueOnce([group1])
      await datastore.dispatch('groups/fetch')
      expect(datastore.getters['groups/all']).toEqual([enrichGroup(group1)])
    })

    it('can not join a group', async () => {
      mockJoin.mockImplementationOnce(throws(new Error('some error')))
      datastore.commit('groups/set', [group1])
      await expect(datastore.dispatch('groups/join', group1.id)).rejects.toHaveProperty('message', 'some error')
    })
  })

  describe('logged in', () => {
    beforeEach(() => {
      datastore = createDatastore({
        groups: require('./groups').default,
        auth,
        banners,
        currentGroup,
        toasts,
      })
    })

    beforeEach(() => {
      datastore.commit('groups/set', [group1, group2, group3])
    })

    it('can fetch my group list', async () => {
      expect(datastore.getters['groups/mine'].map(e => e.id)).toEqual([group2.id, group3.id])
    })

    it('can join a group', async () => {
      mockJoin.mockReturnValueOnce({})
      expect(datastore.getters['groups/mine'].map(e => e.id)).toEqual([group2.id, group3.id])
      await datastore.dispatch('groups/join', group1.id)
      expect(mockRouterPush).toBeCalledWith({ name: 'group', params: { groupId: group1.id } })
      expect(datastore.getters['groups/mine'].map(e => e.id)).toEqual([group1.id, group2.id, group3.id])
    })

    it('can leave a group', async () => {
      mockLeave.mockReturnValueOnce({})
      expect(datastore.getters['groups/mine'].map(e => e.id)).toEqual([group2.id, group3.id])
      await datastore.dispatch('groups/leave', group2.id)
      expect(datastore.getters['groups/mine'].map(e => e.id)).toEqual([group3.id])
      expect(auth.actions.maybeBackgroundSave).toBeCalled()
      expect(auth.actions.maybeBackgroundSave.mock.calls[0][1]).toEqual({ currentGroup: null })
      expect(currentGroup.actions.clear).toBeCalled()
      expect(toasts.actions.show).toBeCalled()
    })

    it('can save a group', async () => {
      mockSave.mockImplementationOnce(group => group)
      await datastore.dispatch('groups/save', { id: group2.id, name: 'new name' })
    })

    it('adds save errors to the group', async () => {
      const validationErrors = { foo: ['bar'] }
      mockSave.mockImplementationOnce(throws(createValidationError(validationErrors)))
      await datastore.dispatch('groups/save', { id: group2.id, name: 'new name' })
      expect(datastore.getters['groups/get'](group2.id)).toEqual({
        ...enrichAsMember(group2),
        saveStatus: statusMocks.validationError('foo', 'bar'),
      })
    })

    it('can update a group', async () => {
      const changed = { ...group1, name: 'new name' }
      datastore.commit('groups/update', [changed])
      expect(datastore.getters['groups/get'](changed.id).name).toEqual(changed.name)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      datastore = createDatastore({
        groups: require('./groups').default,
        auth,
        users,
      })
    })

    beforeEach(() => {
      datastore.commit('groups/set', [group1, group2, group3])
    })

    it('can get a group', () => {
      expect(datastore.getters['groups/get'](group1.id)).toEqual(enrichGroup(group1))
    })

    it('can get myGroups', () => {
      expect(datastore.getters['groups/mine']).toEqual([group2, group3].map(enrichAsMember))
    })

    it('can get otherGroups', () => {
      expect(datastore.getters['groups/other']).toEqual([group1].map(enrichGroup))
    })
  })

  describe('groupPreview', () => {
    beforeEach(() => {
      datastore = createDatastore({
        groups: require('./groups').default,
      })
    })

    it('throws routeError if group does not exist', async () => {
      const select = datastore.dispatch('groups/selectPreview', { groupPreviewId: 9999 })
      await expect(select).rejects.toHaveProperty('type', 'RouteError')
      await expect(select).rejects.toHaveProperty(['data', 'translation'], 'NOT_FOUND.EXPLANATION')
      expect(datastore.getters['groups/activePreview']).toBeUndefined()
    })
  })
})
