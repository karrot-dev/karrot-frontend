import axios from '@/base/api/axios'

export default {

  async subscribe (data) {
    return (await axios.post('/api/subscriptions/web-push/', data)).data
  },

}
