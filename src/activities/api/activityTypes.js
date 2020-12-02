import axios from '@/base/api/axios'

export default {
  async get (activityTypeId) {
    return (await axios.get(`/api/activity-types/${activityTypeId}/`)).data
  },

  async list (filter) {
    const params = filter || {}
    return (await axios.get('/api/activity-types/', { params })).data
  },

  async create (activityType) {
    return (await axios.post('/api/activity-types/', activityType)).data
  },

  async save (activityType) {
    const { id } = activityType
    return (await axios.patch(`/api/activity-types/${id}/`, activityType)).data
  },

  async delete (activityTypeId) {
    return (await axios.delete(`/api/activity-types/${activityTypeId}/`)).data
  },
}
