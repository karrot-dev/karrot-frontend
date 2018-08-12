const mockCreate = jest.fn()
jest.mock('@/services/api/authUser', () => ({ create: mockCreate }))
const mockGet = jest.fn()
const mockGetProfile = jest.fn()
jest.mock('@/services/api/users', () => ({ get: mockGet, getProfile: mockGetProfile }))

import { createStore, throws, createValidationError } from '>/helpers'
import { enrichGroup } from '>/storeHelpers'

function enrich (user, groups, currentUserId) {
  return {
    ...user,
    isCurrentUser: user.id === currentUserId,
    memberships: enrichMemberships(user.memberships, groups, currentUserId),
  }
}

function enrichMemberships (memberships, groups, currentUserId) {
  return Object.entries(memberships).map(([uId, membership]) => {
    const group = groups.find(u => u.id === parseInt(uId))
    return {
      ...membership,
      isEditor: membership.roles.includes('editor'),
      trusted: membership.trustedBy.includes(currentUserId),
      group: enrichGroup(group),
    }
  })
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
      groups: require('./groups').default,
      auth,
      history,
      groupApplications,
      currentGroup: {
        getters: {
          value: () => ({ members: [1, 2], memberships: { 1: {}, 2: {} } }),
        },
      },
    })
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
    },
    actions: {
      login: jest.fn(),
      maybeBackgroundSave: jest.fn(),
    },
  }

  const history = {
    actions: {
      fetchForUser: jest.fn(),
    },
  }

  const groupApplications = {
    getters: {
      getByGroupId: () => () => {},
    },
  }

  beforeEach(() => {
    store.commit('users/set', [user1, user2, user3])
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

  it('can select user profile', async () => {
    const user1Profile = {
      ...user1,
      memberships: {
        1: {
          createdAt: new Date(),
          roles: [],
          trustedBy: [],
        },
      },
    }
    mockGetProfile.mockReturnValueOnce(user1Profile)
    await store.dispatch('users/selectUser', { userId: user1.id })
    expect(store.getters['users/activeUser']).toEqual(enrich(user1Profile, groups, userId))
    expect(history.actions.fetchForUser).toBeCalled()
  })

  it('can update user', () => {
    const changed = { ...user1, displayName: 'new user 1' }
    store.dispatch('users/update', changed)
    expect(store.getters['users/get'](changed.id).displayName).toEqual(changed.displayName)
  })

  it('throws routeError if user is not accessible', async () => {
    mockGetProfile.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    await expect(store.dispatch('users/selectUser', { userId: 9999 }))
      .rejects.toHaveProperty('type', 'RouteError')
  })
})
