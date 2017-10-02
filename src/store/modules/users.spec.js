const mockCreate = jest.fn()
jest.mock('@/services/api/users', () => ({ create: mockCreate }))

import { createStore } from '>/helpers'

describe('users', () => {
  beforeEach(() => jest.resetModules())

  let storeMocks
  let store
  beforeEach(() => {
    storeMocks = {
      auth: {
        actions: {
          login: jest.fn(),
        },
      },
    }
    store = createStore({
      users: require('./users'),
      ...storeMocks,
    })
  })

  it('can signup', async () => {
    let signupData = { email: 'foo@foo.com', password: 'foo' }
    mockCreate.mockImplementation(user => user)
    await store.dispatch('users/signup', signupData)
    expect(mockCreate).toBeCalledWith(signupData)
    expect(storeMocks.auth.actions.login.mock.calls[0][1]).toEqual(signupData)
  })
})
