import axios from '@/base/api/axios'

export default {
  async fetch () {
    return (await axios.get('/api/config/')).data
  },
}
