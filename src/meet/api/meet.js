import axios from '@/base/api/axios'

export default {
  async listRooms () {
    return (await axios.get('/api/meet/rooms/')).data
  },

  async getToken (subject) {
    return (await axios.get('/api/meet/token/', { params: { subject } })).data.token
  },
}
