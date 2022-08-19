import { createDatastore, createValidationError, throws } from '>/helpers'
import { router } from '>/routerMocks'

const mockStatus = jest.fn()
const mockLogin = jest.fn()
jest.mock('@/authuser/api/auth', () => ({ login: mockLogin }))
jest.mock('@/authuser/api/authUser', () => ({ get: mockStatus }))

describe('auth', () => {
  let datastore
  let datastoreMocks

  beforeEach(() => jest.resetModules())

  beforeEach(() => {
    datastoreMocks = {
      i18n: {
        actions: {
          setLocale: jest.fn(),
        },
      },
    }
    datastore = createDatastore({
      auth: require('./auth').default,
      ...datastoreMocks,
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
    expect(router.push).toBeCalledWith('/')
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
