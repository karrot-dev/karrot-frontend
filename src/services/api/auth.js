import axios from '@/services/axios'
import authUser from '@/services/api/authUser'

let updateToken, clearToken

if (CORDOVA) {
  const KEY = 'token'
  const { localStorage } = window

  const setHeader = token => {
    axios.defaults.headers.common.Authorization = `TOKEN ${token}`
  }

  const clearHeader = () => {
    delete axios.defaults.headers.common.Authorization
  }

  clearToken = () => {
    localStorage.removeItem(KEY)
    clearHeader()
  }

  updateToken = token => {
    localStorage.setItem(KEY, token)
    setHeader(token)
  }

  const token = localStorage.getItem(KEY)
  if (token) setHeader(token)
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
}
