import MockAdapter from 'axios-mock-adapter'
import axios from '@/services/axios'

describe('services/api/auth', () => {
  describe('in cordova', () => {
    let mock, auth, lastRequest

    const token = 'sometoken'
    const email = 'foo@foo.com'
    const password = 'foo'

    const requestInterceptor = config => {
      lastRequest = config
      return config
    }

    beforeEach(() => axios.interceptors.request.use(requestInterceptor))
    afterEach(() => axios.interceptors.request.eject(requestInterceptor))

    beforeEach(() => {
      lastRequest = null
      mock = new MockAdapter(axios)
      global.CORDOVA = true
      global.location.reload = jest.fn()
      auth = require('@/services/api/auth').default
      mock.onGet('/api/auth/user/').reply(200, { email })
    })

    it('saves the token after login', async () => {
      mock.onPost('/api/auth/token/').reply(200, { token })
      await auth.login({ email, password })
      expect(localStorage.setItem).toHaveBeenCalledWith('token', token)
      expect(axios.defaults.headers.common.Authorization).toBe(`TOKEN ${token}`)
      expect(auth.getToken()).toBe(token)
    })

    it('uses the token in subsequent requests', async () => {
      mock.onPost('/api/auth/token/').reply(200, { token })
      await auth.login({ email, password })
      mock.onGet('/random/path').reply(200, 'yay')
      await axios.get('/random/path')
      expect(lastRequest.headers.Authorization).toBe(`TOKEN ${token}`)
    })

    it('clears the token and reloads if authentication fails', async () => {
      mock.onPost('/api/auth/token/').reply(200, { token })
      await auth.login({ email, password })
      mock.onGet('/random/path').reply(403, { error_code: 'authentication_failed' })
      await axios.get('/random/path')
      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
      expect(axios.defaults.headers.common.Authorization).toBeUndefined()
      expect(auth.getToken()).toBeFalsy()
      expect(global.location.reload).toHaveBeenCalled()
    })

    it('does nothing fancy if authentication fails during explicit auth attempt', async () => {
      mock.onPost('/api/auth/token/').reply(403, { error_code: 'authentication_failed' })
      await expect(auth.login({ email, password })).rejects.toHaveProperty('response.data.errorCode', 'authentication_failed')
      expect(global.location.reload).not.toHaveBeenCalled()
    })
  })
})
