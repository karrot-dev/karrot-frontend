import axios from '@/services/axios'

export default {

  async create (data) {
    return (await axios.post('/api/subscriptions/push/', data)).data
  },

  async list () {
    return (await axios.get('/api/subscriptions/push/')).data
  },

  async delete (subscriptionId) {
    return (await axios.delete(`/api/subscriptions/push/${subscriptionId}/`)).data
  },

}
