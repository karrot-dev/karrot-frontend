import axios from '@/base/api/axios'

export default {
  async fetch (fields) {
    const params = fields ? { fields: fields.join(',') } : {}
    return (await axios.get('/api/bootstrap/', { params })).data
  },
}
