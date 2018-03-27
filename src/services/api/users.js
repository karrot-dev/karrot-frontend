import axios from '@/services/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/users/${id}/`)).data
  },

  async list () {
    return (await axios.get('/api/users/')).data
  },

  async search (query) {
    return (await axios.get('/api/users/', { params: { search: query } })).data
  },

  requestDeleteAccount () {
    return axios.post('/api/auth/user/request_delete/')
  },

  deleteAccount (code) {
    return axios.delete('/api/auth/user/', { params: { code: code } })
  },
}
