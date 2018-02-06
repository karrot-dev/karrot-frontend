import axios from '@/services/axios'

export default {
  async create (invitation) {
    return (await axios.post('/api/invitations/', invitation)).data
  },

  async get (invitationId) {
    return (await axios.get(`/api/invitations/${invitationId}/`)).data
  },

  async list () {
    return (await axios.get('/api/invitations/')).data
  },

  async listByGroupId (groupId) {
    return (await axios.get('/api/invitations/', { params: { group: groupId } })).data
  },

  async accept (token) {
    return (await axios.post(`/api/invitations/${token}/accept/`)).data
  },
}

export function convertEntry (val) {
  if (Array.isArray(val)) {
    return val.map(convertEntry)
  }
  else {
    return {
      ...val,
      expiresAt: new Date(val.expiresAt),
    }
  }
}
