const mockCreate = jest.fn()
jest.mock('@/authuser/api/authUser', () => ({ create: mockCreate }))
const mockGet = jest.fn()
const mockGetProfile = jest.fn()
jest.mock('@/users/api/users', () => ({ get: mockGet, getProfile: mockGetProfile }))

import { createStore, throws, createValidationError, nextTicks } from '>/helpers'
import { enrichGroup } from '>/storeHelpers'

function enrich (user, groups, currentUserId) {
  return {
    ...user,
    isCurrentUser: user.id === currentUserId,
    membership: {},
    groups: user.groups.map(groupId => enrichGroup(groups.find(g => g.id === groupId))),
  }
}

describe('users', () => {
  beforeEach(() => jest.resetModules())
  beforeEach(() => jest.resetAllMocks())

  let store

  let user1, user2, user3
  let userId
  let groups
  beforeEach(() => {
    store = createStore({
      users: require('./users').default,
      groups: require('../../groupInfo/datastore/groups').default,
      auth,
      history,
      groupApplications,
      currentGroup: {
        getters: {
          value: () => ({ members: [1, 2], memberships: { 1: {}, 2: {} } }),
          memberships: () => ({ 1: {}, 2: {} }),
        },
        actions: {
          selectFromCurrentUser: jest.fn(),
        },
      },
    }, { plugins: [require('./users').plugin] })
  })

  beforeEach(() => {
    userId = 1
    user1 = { id: 1, displayName: 'user 1' }
    user2 = { id: 2, displayName: 'user 2' }
    user3 = { id: 3, displayName: 'user 3' }
    groups = [
      {
        id: 1,
      },
    ]
  })

  const auth = {
    getters: {
      userId: () => userId,
      user: () => ({
        currentGroup: 1,
      }),
      currentGroupId: () => 1,
    },
    actions: {
      login: jest.fn(),
      maybeBackgroundSave: jest.fn(),
    },
  }

  const history = {
    actions: {
      fetchForUserInGroup: jest.fn(),
    },
  }

  const groupApplications = {
    getters: {
      getByGroupId: () => () => {},
    },
  }

  beforeEach(() => {
    store.commit('users/update', [user1, user2, user3])
    store.commit('groups/set', groups)
  })

  it('can signup', async () => {
    let signupData = { email: 'foo@foo.com', password: 'foo' }
    mockCreate.mockImplementation(user => user)
    await store.dispatch('users/signup', { userData: signupData })
    expect(mockCreate).toBeCalledWith(signupData)
    expect(auth.actions.login.mock.calls[0][1]).toEqual(signupData)
  })

  it('can get all entries', () => {
    expect(store.getters['users/all'].map(e => e.id)).toEqual([user1.id, user2.id, user3.id])
  })

  it('can get users by current group id', () => {
    expect(store.getters['users/byCurrentGroup'].map(e => e.id)).toEqual([user1.id, user2.id])
  })

  it.only('can select user profile', async () => {
    const user1Profile = {
      ...user1,
      groups: [1],
    }
    mockGetProfile.mockReturnValueOnce(user1Profile)
    await store.dispatch('users/selectUser', { userId: user1.id })
    await nextTicks(2)
    store.commit('users/update', [{ ...user1, displayName: 'asdf' }])
    await nextTicks(4)
    expect(store.getters['users/activeUser']).toEqual(enrich(user1Profile, groups, userId))
    expect(history.actions.fetchForUserInGroup).toBeCalled()
  })

  it('can update user', () => {
    const changed = { ...user1, displayName: 'new user 1' }
    store.commit('users/update', [changed])
    expect(store.getters['users/get'](changed.id).displayName).toEqual(changed.displayName)
  })

  it('throws routeError if user is not accessible', async () => {
    mockGetProfile.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(store.dispatch('users/selectUser', { userId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
  })
})
