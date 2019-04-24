import axios from '@/base/api/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/places-info/${id}/`)).data
  },

  async list () {
    return (await axios.get('/api/places-info/')).data
  },
}
