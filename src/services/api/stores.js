import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/stores/', data)).data
  },

  async get (groupId) {
    return (await axios.get(`/api/stores/${groupId}/`)).data
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

  async save (store) {
    let storeId = store.id
    return (await axios.patch(`/api/stores/${storeId}/`, store)).data
  },

  delete (storeId) {
    return axios.delete(`/api/stores/${storeId}/`)
  }
}
