import axios from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {
  async get (id) {
    return (await axios.get(`/api/users/${id}/`)).data
  },

  async getProfile (id) {
    return (await axios.get(`/api/users/${id}/profile/`)).data
  },

  async getInfo (id) {
    return (await axios.get(`/api/users-info/${id}/`)).data
  },

  async list () {
    return (await axios.get('/api/users/')).data
  },

  async search (query) {
    return (await axios.get('/api/users/', { params: { search: query } })).data
  },

  requestDeleteAccount () {
    // TODO: move to authuser API file
    return axios.post('/api/auth/user/request_delete/')
  },

  deleteAccount (code) {
    // TODO: move to authuser API file
    return axios.delete('/api/auth/user/', { params: { code: code } })
  },

  async conversation (userId) {
    return convertConversation((await axios.get(`/api/users/${userId}/conversation/`)).data)
  },
}
