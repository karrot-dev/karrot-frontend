import axios from '@/base/api/axios'

export default {
  async get () {
    return (await axios.get('/about.json')).data
  },
}
