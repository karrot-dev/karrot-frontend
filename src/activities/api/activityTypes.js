import axios from '@/base/api/axios'

export default {
  async list (filter) {
    const params = filter || {}
    return (await axios.get('/api/activity-types/', { params })).data
  },
}
