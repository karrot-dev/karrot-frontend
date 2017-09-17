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

  async listByGroupId (groupId) {
    return (await axios.get('/api/stores/', { params: { group: groupId } })).data
  },

  async listStoresInGroupByName (group, name) {
    return (await axios.get('/api/stores/', { params: { group, name } })).data
  },

  async search (query) {
    return (await axios.get('/api/stores/', { params: { search: query } })).data
  },

  async save (obj) {
    return (await axios.patch(`/api/stores/${obj.id}/`, obj)).data
  },

  delete (id) {
    return axios.delete(`/api/stores/${id}/`)
  },
}
