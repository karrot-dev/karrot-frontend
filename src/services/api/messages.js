import axios from '@/services/axios'

export default {

  async create (data) {
    return (await axios.post('/api/messages/', data)).data
  },

  async list (conversationId) {
    return (await axios.get('/api/messages/', { params: { conversation: conversationId } })).data.slice(-2) // TODO: Remove, only here for faster loading for dev
  },
}
