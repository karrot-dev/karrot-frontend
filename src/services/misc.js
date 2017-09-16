import axios from '@/services/axios'

export default {
  async about (data) {
    return (await axios.get('/about.json')).data
  }
}
