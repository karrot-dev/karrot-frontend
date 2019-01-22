import axios from '@/base/api/axios'

export default {
  async unsubscribe (token, data) {
    return (await axios.post(`/api/unsubscribe/${token}/`, data)).data
  },
}
