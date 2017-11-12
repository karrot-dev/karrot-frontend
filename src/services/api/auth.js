import axios from '@/services/axios'

export default {
  async login (data) {
    return (await axios.post('/api/auth/', data)).data
  },

  async logout () {
    return (await axios.post('/api/auth/logout/', {})).data
  },
}
