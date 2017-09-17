import axios from '@/services/axios'

export default {
  async get () {
    return (await axios.get('/about.json')).data
  }
}
