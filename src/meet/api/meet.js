import axios from '@/base/api/axios'

export default {
  async getToken ({ roomId }) {
    return (await axios.get(`/api/meet/${roomId}/token/`)).data.token
  },
}
