import axios from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {
  async create (data) {
    return convert((await axios.post('/api/applications/', data)).data)
  },

  async get (applicationId) {
    return convert((await axios.get(`/api/applications/${applicationId}/`)).data)
  },

  async list (filter) {
    return convert((await axios.get('/api/applications/', { params: filter })).data)
  },

  async accept (applicationId) {
    return convert((await axios.post(`/api/applications/${applicationId}/accept/`)).data)
  },

  async decline (applicationId) {
    return convert((await axios.post(`/api/applications/${applicationId}/decline/`)).data)
  },

  async withdraw (applicationId) {
    return convert((await axios.post(`/api/applications/${applicationId}/withdraw/`)).data)
  },

  async conversation (pickupId) {
    return convertConversation((await axios.get(`/api/applications/${pickupId}/conversation/`)).data)
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
      decidedAt: val.decidedAt && new Date(val.decidedAt),
    }
  }
}
