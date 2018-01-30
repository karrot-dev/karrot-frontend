import axios from '@/services/axios'

export default {
  async get (id) {
    return parseDates((await axios.get(`/api/conversations/${id}/`)).data)
  },

  async mark (id, data) {
    return (await axios.post(`/api/conversations/${id}/mark/`, data)).data
  },
}

export function parseDates (obj) {
  return {
    ...obj,
    createdAt: new Date(obj.createdAt),
    updatedAt: new Date(obj.updatedAt),
  }
}
