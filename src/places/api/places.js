import axios from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {
  async create (data) {
    return (await axios.post('/api/places/', data)).data
  },

  async get (id) {
    return (await axios.get(`/api/places/${id}/`)).data
  },

  async list () {
    return (await axios.get('/api/places/')).data
  },

  async search (query) {
    return (await axios.get('/api/places/', { params: { search: query } })).data
  },

  async save (obj) {
    return (await axios.patch(`/api/places/${obj.id}/`, obj)).data
  },

  async statistics (id) {
    return (await axios.get(`/api/places/${id}/statistics/`)).data
  },

  async subscribe (id) {
    await axios.post(`/api/places/${id}/subscription/`)
  },

  async unsubscribe (id) {
    await axios.delete(`/api/places/${id}/subscription/`)
  },

  async conversation (id) {
    return convertConversation((await axios.get(`/api/places/${id}/conversation/`)).data)
  },
}
