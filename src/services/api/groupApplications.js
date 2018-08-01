import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/group-applications/', data)).data
  },

  // async get (data) {
  //   return (await axios.get('/api/group-applications/{id}/', data)).data
  // },

  async list (filter) {
    return convert((await axios.get('/api/group-applications/', { params: filter })).data)
  },

  async accept (applicationId) {
    return (await axios.post(`/api/group-applications/${applicationId}/accept/`)).data
  },

  async decline (applicationId) {
    return (await axios.post(`/api/group-applications/${applicationId}/decline/`)).data
  },

  async withdraw (applicationId) {
    return (await axios.post(`/api/group-applications/${applicationId}/withdraw/`)).data
  },
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    let createdAt = new Date(val.createdAt)
    return { ...val, createdAt }
  }
}
