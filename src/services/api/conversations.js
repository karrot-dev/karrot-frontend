import axios from '@/services/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/conversations/${id}/`)).data
  },

  async mark (id, data) {
    return (await axios.post(`/api/conversations/${id}/mark/`, data)).data
  },
}
