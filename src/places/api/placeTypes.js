import axios from '@/base/api/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/place-types/${id}/`)).data
  },

  async list (filter) {
    const params = filter || {}
    return (await axios.get('/api/place-types/', { params })).data
  },

  async create (data) {
    return (await axios.post('/api/place-types/', data)).data
  },

  async save (data) {
    const { id } = data
    return (await axios.patch(`/api/place-types/${id}/`, data)).data
  },

  async delete (id) {
    return (await axios.delete(`/api/place-types/${id}/`)).data
  },
}
