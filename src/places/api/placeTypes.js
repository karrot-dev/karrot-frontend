import axios from '@/base/api/axios'

export default {
  async get (placeTypeId) {
    return (await axios.get(`/api/place-types/${placeTypeId}/`)).data
  },

  async list (filter) {
    const params = filter || {}
    return (await axios.get('/api/place-types/', { params })).data
  },

  async create (placeType) {
    return (await axios.post('/api/place-types/', placeType)).data
  },

  async save (placeType) {
    const { id } = placeType
    return (await axios.patch(`/api/place-types/${id}/`, placeType)).data
  },

  async delete (placeTypeId) {
    return (await axios.delete(`/api/place-types/${placeTypeId}/`)).data
  },
}
