import { convert as convertActivity } from '@/activities/api/activities'
import axios, { parseCursor } from '@/base/api/axios'

export default {
  async create (feedback) {
    return convert((await axios.post('/api/feedback/', feedback)).data)
  },

  async get (feedbackId) {
    return convert((await axios.get(`/api/feedback/${feedbackId}/`)).data)
  },

  async list (filter) {
    const response = (await axios.get('/api/feedback/', { params: filter })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convertListResults(response.results),
    }
  },

  async save (feedback) {
    return convert((await axios.patch(`/api/feedback/${feedback.id}/`, feedback)).data)
  },
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    return {
      ...val,
      createdAt: new Date(val.createdAt),
      weight: val.weight !== null ? parseFloat(val.weight) : null,
    }
  }
}

function convertListResults (results) {
  return {
    feedback: convert(results.feedback),
    activities: convertActivity(results.activities),
  }
}
