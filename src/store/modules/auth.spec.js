const mockStatus = jest.fn()
const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/router', () => ({ push: mockRouterPush }))
jest.mock('@/services/api/auth', () => ({ login: mockLogin }))
jest.mock('@/services/api/authUser', () => ({ get: mockStatus }))

import { createStore, throws } from '>/helpers'

describe('auth', () => {
  let store
  let storeMocks

  beforeEach(() => jest.resetModules())

  beforeEach(() => {
    storeMocks = {
      i18n: {
        actions: {
          setLocale: jest.fn(),
        },
      },
    }
    store = createStore({
      auth: require('./auth'),
      ...storeMocks,
    })
  })

  const user = () => ({ name: 'Alex' })

  it('can check login status', async () => {
    mockStatus.mockReturnValueOnce(user())
    await store.dispatch('auth/check')
    expect(store.getters['auth/isLoggedIn']).toBe(true)
    expect(store.getters['auth/user']).toBeDefined()
  })

  it('can login', async () => {
    mockLogin.mockReturnValueOnce(user())
    await store.dispatch('auth/login')
    expect(store.getters['auth/status'].error).toBeNull()
    expect(store.getters['auth/isLoggedIn']).toBe(true)
    expect(store.getters['auth/user']).toBeDefined()
    expect(mockRouterPush).toBeCalledWith('/')
  })

  it('will not be logged when status throws', async () => {
    mockStatus.mockImplementation(throws(() => new Error('some error')))
    await store.dispatch('auth/check')
    expect(store.getters['auth/isLoggedIn']).toBe(false)
    expect(store.getters['auth/user']).toBeNull()
  })

  it('will not be logged in when login throws', async () => {
    mockLogin.mockImplementationOnce(throws({ response: { data: { foo: 'some error info' }, status: 403 } }))
    await store.dispatch('auth/login')
    expect(store.getters['auth/isLoggedIn']).toBe(false)
    expect(store.getters['auth/status'].error).toEqual({ foo: 'some error info' })
    expect(store.getters['auth/user']).toBeNull()
  })
})
