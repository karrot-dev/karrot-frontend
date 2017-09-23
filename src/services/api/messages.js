import axios from '@/services/axios'

export default {

  async create (data) {
    return (await axios.post('/api/messages/', data)).data
  },

  async list (conversationId) {
    return (await axios.get('/api/messages/', { params: { conversation: conversationId } })).data
      .slice(-10) // TODO: Remove, only here for faster loading for dev
      .map(e => {
        e.createdAt = new Date(e.createdAt)
        return e
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  },
}
