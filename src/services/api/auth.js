import axios from '@/services/axios'
import authUser from '@/services/api/authUser'

let KEY, updateToken, clearToken

if (__ENV.CORDOVA) {
  const { localStorage } = window

  KEY = 'token'

  clearToken = () => {
    localStorage.removeItem(KEY)
    clearHeader()
  }

  updateToken = token => {
    localStorage.setItem(KEY, token)
    setHeader(token)
  }

  const initialize = () => {
    const token = localStorage.getItem(KEY)
    if (token) setHeader(token)
  }

  const setHeader = token => {
    axios.defaults.headers.common.Authorization = `TOKEN ${token}`
  }

  const clearHeader = () => {
    delete axios.defaults.headers.common.Authorization
  }

  /**
   * Returns true for any authentication failure, except for actual authentication requests
   */
  const isInvalidTokenError = error => {
    const { response: { data = {}, config: { method, baseURL, url } = {} } = {} } = error
    if (data.errorCode === 'authentication_failed') {
      const path = url.indexOf(baseURL) === 0 ? url.substring(baseURL.length) : url
      // true for anything other than a legitimate authentication request
      return method !== 'post' || path !== '/api/auth/token/'
    }
    return false
  }

  axios.interceptors.response.use(response => response, async error => {
    if (isInvalidTokenError(error)) {
      clearToken()
      location.reload() // this is a bit of a heavy thing to do, a full page refresh, but it should be rare
    }
    else {
      throw error
    }
  })

  initialize()
}

export default {
  async login ({ email, password }) {
    if (__ENV.CORDOVA) {
      const { token } = (await axios.post('/api/auth/token/', { username: email, password })).data
      updateToken(token)
      return authUser.get() // return the user info to match what the /api/auth/ endpoints returns
    }
    else {
      return (await axios.post('/api/auth/', { email, password })).data
    }
  },

  async logout () {
    if (__ENV.CORDOVA) clearToken()
    return (await axios.post('/api/auth/logout/', {})).data
  },

  getToken () {
    if (__ENV.CORDOVA) {
      return localStorage.getItem(KEY)
    }
    else {
      throw new Error('getToken() is only available inside cordova environment')
    }
  },

  requestResetPassword (email) {
    return axios.post('/api/auth/password/request_reset/', { email })
  },

  resetPassword (data) {
    return axios.post('/api/auth/password/reset/', data)
  },

  changePassword (data) {
    return axios.put('/api/auth/password/', data)
  },

  changeEmail (data) {
    return axios.put('/api/auth/email/', data)
  },

  verifyMail (code) {
    return axios.post('/api/auth/email/verify/', { code })
  },

  resendVerificationCode () {
    return axios.post('/api/auth/email/resend_verification_code/')
  },
}
