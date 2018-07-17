import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/stores/', data)).data
  },

  async get (id) {
    return (await axios.get(`/api/stores/${id}/`)).data
  },

  async list () {
    return (await axios.get('/api/stores/')).data
  },

  async search (query) {
    return (await axios.get('/api/stores/', { params: { search: query } })).data
  },

  async save (obj) {
    return (await axios.patch(`/api/stores/${obj.id}/`, obj)).data
  },

  async statistics (id) {
    return (await axios.get(`/api/stores/${id}/statistics/`)).data
  },
}
