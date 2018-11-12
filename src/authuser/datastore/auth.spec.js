const mockStatus = jest.fn()
const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/base/router', () => ({ push: mockRouterPush }))
jest.mock('@/authuser/api/auth', () => ({ login: mockLogin }))
jest.mock('@/authuser/api/authUser', () => ({ get: mockStatus }))

import { createDatastore, createValidationError, throws } from '>/helpers'

describe('auth', () => {
  let datastore
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
    datastore = createDatastore({
      auth: require('./auth').default,
      ...storeMocks,
    })
  })

  const user = () => ({ displayName: 'Alex' })

  it('can check login status', async () => {
    mockStatus.mockReturnValueOnce(user())
    await datastore.dispatch('auth/refresh')
    expect(datastore.getters['auth/isLoggedIn']).toBe(true)
    expect(datastore.getters['auth/user']).toBeDefined()
  })

  it('can login', async () => {
    mockLogin.mockReturnValueOnce(user())
    await datastore.dispatch('auth/login')
    expect(datastore.getters['auth/loginStatus'].validationErrors).toEqual({})
    expect(datastore.getters['auth/isLoggedIn']).toBe(true)
    expect(datastore.getters['auth/user']).toBeDefined()
    expect(mockRouterPush).toBeCalledWith('/')
  })

  it('can update user', () => {
    const changed = { ...user(), displayName: 'Alex2' }
    datastore.commit('auth/setUser', changed)
    expect(datastore.getters['auth/user'].displayName).toEqual(changed.displayName)
  })

  it('will not be logged when status throws', async () => {
    mockStatus.mockImplementation(throws(createValidationError({ foo: 'some error info' })))
    await datastore.dispatch('auth/refresh')
    expect(datastore.getters['auth/isLoggedIn']).toBe(false)
    expect(datastore.getters['auth/user']).toBeNull()
  })

  it('will not be logged in when login throws', async () => {
    mockLogin.mockImplementationOnce(throws(createValidationError({ foo: 'some error info' })))
    await datastore.dispatch('auth/login')
    expect(datastore.getters['auth/isLoggedIn']).toBe(false)
    expect(datastore.getters['auth/loginStatus'].validationErrors).toEqual({ foo: 'some error info' })
    expect(datastore.getters['auth/user']).toBeNull()
  })
})
