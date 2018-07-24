import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/trust/', data)).data
  },

  async listByUserId (user) {
    return (await axios.get('/api/trust/', { params: { user } })).data
  },

  async listByGroupId (group) {
    return (await axios.get('/api/trust/', { params: { group } })).data
  },
}
