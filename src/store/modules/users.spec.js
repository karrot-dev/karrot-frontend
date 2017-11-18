const mockCreate = jest.fn()
jest.mock('@/services/api/authUser', () => ({ create: mockCreate }))
const mockGet = jest.fn()
jest.mock('@/services/api/users', () => ({ get: mockGet }))

import { createStore, throws } from '>/helpers'

const auth = {
  actions: {
    login: jest.fn(),
  },
}

const routeError = {
  actions: {
    set: jest.fn(),
  },
}

describe('users', () => {
  beforeEach(() => jest.resetModules())

  let store

  let user1, user2, user3
  beforeEach(() => {
    store = createStore({
      users: require('./users'),
      auth,
      routeError,
      groups: {
        getters: {
          activeGroup: () => ({ members: [1, 2] }),
        },
      },
    })
  })

  beforeEach(() => {
    user1 = { id: 1, name: 'user 1' }
    user2 = { id: 2, name: 'user 2' }
    user3 = { id: 3, name: 'user 3' }
  })

  beforeEach(() => {
    store.commit('users/Receive Users', { users: [user1, user2, user3] })
  })

  it('can signup', async () => {
    let signupData = { email: 'foo@foo.com', password: 'foo' }
    mockCreate.mockImplementation(user => user)
    await store.dispatch('users/signup', signupData)
    expect(mockCreate).toBeCalledWith(signupData)
    expect(auth.actions.login.mock.calls[0][1]).toEqual(signupData)
  })

  it('can get all entries', () => {
    expect(store.getters['users/all'].map(e => e.id)).toEqual([user1.id, user2.id, user3.id])
  })

  it('can get users by active group id', () => {
    expect(store.getters['users/byActiveGroup'].map(e => e.id)).toEqual([user1.id, user2.id])
  })

  it('sets routeError if user is not accessible', () => {
    mockGet.mockImplementationOnce(throws(createValidationError({ detail: 'Not found' })))
    store.dispatch('users/selectUser', 9999)
    expect(routeError.actions.set).toBeCalled()
  })
})
