const mockCreate = jest.fn()
jest.mock('@/authuser/api/authUser', () => ({ create: mockCreate }))
const mockGet = jest.fn()
const mockGetProfile = jest.fn()
jest.mock('@/users/api/users', () => ({ get: mockGet, getProfile: mockGetProfile }))

import { createDatastore, throws, createValidationError } from '>/helpers'
import { enrichGroup } from '>/datastoreHelpers'

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

  let datastore

  let user1, user2, user3
  let userId
  let groups
  beforeEach(() => {
    datastore = createDatastore({
      users: require('./users').default,
      groups: require('@/groupInfo/datastore/groups').default,
      auth,
      history,
      applications,
      currentGroup: {
        getters: {
          value: () => ({ members: [1, 2], memberships: { 1: {}, 2: {} } }),
          memberships: () => ({ 1: {}, 2: {} }),
        },
        actions: {
          selectFromCurrentUser: jest.fn(),
        },
      },
      issues: {
        actions: {
          fetchOngoingByGroupId: jest.fn(),
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
      fetch: jest.fn(),
    },
  }

  const applications = {
    getters: {
      getByGroupId: () => () => {},
    },
  }

  beforeEach(() => {
    datastore.commit('users/update', [user1, user2, user3])
    datastore.commit('groups/set', groups)
  })

  it('can signup', async () => {
    let signupData = { email: 'foo@foo.com', password: 'foo' }
    mockCreate.mockImplementation(user => user)
    await datastore.dispatch('users/signup', { userData: signupData })
    expect(mockCreate).toBeCalledWith(signupData)
    expect(auth.actions.login.mock.calls[0][1]).toEqual(signupData)
  })

  it('can get all entries', () => {
    expect(datastore.getters['users/all'].map(e => e.id)).toEqual([user1.id, user2.id, user3.id])
  })

  it('can get users by current group id', () => {
    expect(datastore.getters['users/byCurrentGroup'].map(e => e.id)).toEqual([user1.id, user2.id])
  })

  it('can select user profile', async () => {
    const user1Profile = {
      ...user1,
      groups: [1],
    }
    mockGetProfile.mockReturnValueOnce(user1Profile)
    await datastore.dispatch('users/selectUser', { userId: user1.id })
    datastore.commit('users/update', [{ ...user1, displayName: 'asdf' }])
    expect(datastore.getters['users/activeUser']).toEqual(enrich(user1Profile, groups, userId))
    expect(history.actions.fetch.mock.calls[0][1]).toEqual({ userId: 1, groupId: 1 })
  })

  it('can update user', () => {
    const changed = { ...user1, displayName: 'new user 1' }
    datastore.commit('users/update', [changed])
    expect(datastore.getters['users/get'](changed.id).displayName).toEqual(changed.displayName)
  })

  it('throws routeError if user is not accessible', async () => {
    mockGetProfile.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(datastore.dispatch('users/selectUser', { userId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
  })
})
