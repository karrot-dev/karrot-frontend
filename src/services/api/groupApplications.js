import axios from '@/services/axios'

export default {
  async create (groupId, data) {
    console.log('show me!!', groupId, data)
    return (await axios.post('/api/group-applications/', groupId, data)).data
  },

  async get (data) {
    return (await axios.get('/api/group-applications/{id}/', data)).data
  },

  // async list () {
  //   return (await axios.get('/api/group-applications/', data)).data
  // },

  async listByGroupId (data) {
    return (await axios.get('/api/group-applications/', data)).data
  },

  async accept (data) {
    return (await axios.post('/api/group-applications/{id}/accept', data)).data
  },

  async decline (data) {
    return (await axios.post('/api/group-applications/{id}/decline', data)).data
  },

  async withdraw (data) {
    return (await axios.post('/api/group-applications/{id}/withdraw', data)).data
  },
}
