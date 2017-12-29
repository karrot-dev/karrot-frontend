import axios from '@/services/axios'

export default {
  async create (feedback) {
    return (await axios.post('/api/feedback/', feedback)).data
  },

  async get (feedbackId) {
    return convertDate((await axios.get(`/api/feedback/${feedbackId}/`)).data)
  },

  async list (filter) {
    return convertDate((await axios.get('/api/feedback/', { params: filter })).data)
  },

  async save (feedback) {
    return (await axios.patch(`/api/feedback/${feedback.id}/`)).data
  },
}

function convertDate (val) {
  if (Array.isArray(val)) {
    return val.map(convertDate)
  }
  else {
    return { ...val, createdAt: new Date(val.createdAt) }
  }
}
