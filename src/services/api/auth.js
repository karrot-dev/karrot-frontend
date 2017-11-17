import axios from '@/services/axios'
import authUser from '@/services/api/authUser'

let KEY, updateToken, clearToken

if (CORDOVA) {
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

  initialize()
}

export default {
  async login ({ email, password }) {
    if (CORDOVA) {
      const { token } = (await axios.post('/api/auth/token/', { username: email, password })).data
      updateToken(token)
      return authUser.get() // return the user info to match what the /api/auth/ endpoints returns
    }
    else {
      return (await axios.post('/api/auth/', { email, password })).data
    }
  },

  async logout () {
    if (CORDOVA) clearToken()
    return (await axios.post('/api/auth/logout/', {})).data
  },

  getToken () {
    if (CORDOVA) {
      return localStorage.getItem(KEY)
    }
    else {
      throw new Error('getToken() is only available inside cordova environment')
    }
  },
}
