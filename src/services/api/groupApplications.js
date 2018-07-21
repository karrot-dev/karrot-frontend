import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/group-applications/', data)).data
  },
