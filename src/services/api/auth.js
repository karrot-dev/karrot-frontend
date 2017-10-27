import axios from '@/services/axios'

export default {
  async login ({ email, password }) {
    if (CORDOVA) {
      const { token } = (await axios.post('/api/auth/token/', { username: email, password })).data
      axios.defaults.headers.common.Authorization = `TOKEN ${token}`
      return this.status()
    }
    else {
      return (await axios.post('/api/auth/', { email, password })).data
    }
  },

  async logout () {
    if (CORDOVA) delete axios.defaults.headers.common.Authorization
    return (await axios.post('/api/auth/logout/', {})).data
  },
}
