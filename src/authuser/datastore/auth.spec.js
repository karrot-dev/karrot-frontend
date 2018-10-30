const mockStatus = jest.fn()
const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/base/router', () => ({ push: mockRouterPush }))
jest.mock('@/authuser/api/auth', () => ({ login: mockLogin }))
jest.mock('@/authuser/api/authUser', () => ({ get: mockStatus }))

import { createStore, createValidationError, throws } from '>/helpers'

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
      auth: require('./auth').default,
      ...storeMocks,
    })
  })

  const user = () => ({ displayName: 'Alex' })

  it('can check login status', async () => {
    mockStatus.mockReturnValueOnce(user())
    await store.dispatch('auth/refresh')
    expect(store.getters['auth/isLoggedIn']).toBe(true)
    expect(store.getters['auth/user']).toBeDefined()
  })

  it('can login', async () => {
    mockLogin.mockReturnValueOnce(user())
    await store.dispatch('auth/login')
    expect(store.getters['auth/loginStatus'].validationErrors).toEqual({})
    expect(store.getters['auth/isLoggedIn']).toBe(true)
    expect(store.getters['auth/user']).toBeDefined()
    expect(mockRouterPush).toBeCalledWith('/')
  })

  it('can update user', () => {
    const changed = { ...user(), displayName: 'Alex2' }
    store.commit('auth/setUser', changed)
    expect(store.getters['auth/user'].displayName).toEqual(changed.displayName)
  })

  it('will not be logged when status throws', async () => {
    mockStatus.mockImplementation(throws(createValidationError({ foo: 'some error info' })))
    await store.dispatch('auth/refresh')
    expect(store.getters['auth/isLoggedIn']).toBe(false)
    expect(store.getters['auth/user']).toBeNull()
  })

  it('will not be logged in when login throws', async () => {
    mockLogin.mockImplementationOnce(throws(createValidationError({ foo: 'some error info' })))
    await store.dispatch('auth/login')
    expect(store.getters['auth/isLoggedIn']).toBe(false)
    expect(store.getters['auth/loginStatus'].validationErrors).toEqual({ foo: 'some error info' })
    expect(store.getters['auth/user']).toBeNull()
  })
})
