import axios from '@/services/axios'

export default {
  async get (id) {
    return convert((await axios.get(`/api/conversations/${id}/`)).data)
  },

  async mark (id, data) {
    return (await axios.post(`/api/conversations/${id}/mark/`, data)).data
  },
}

export function convert (obj) {
  return {
    ...obj,
    createdAt: new Date(obj.createdAt),
    updatedAt: new Date(obj.updatedAt),
  }
}
