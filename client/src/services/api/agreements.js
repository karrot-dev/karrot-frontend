import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/agreements/', data)).data
  },

  async get (agreementId) {
    return (await axios.get(`/api/agreements/${agreementId}/`)).data
  },

  async list () {
    return (await axios.get('/api/agreements/')).data
  },

  async save (data) {
    const { id } = data
    return (await axios.patch(`/api/agreements/${id}/`, data)).data
  },

  async agree (id) {
    return (await axios.post(`/api/agreements/${id}/agree/`)).data
  },
}
