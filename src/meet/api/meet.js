import axios from '@/base/api/axios'

export default {
  async getToken () {
    return (await axios.get('/api/meet/')).data.token
  },
}
