import axios from '@/base/api/axios'

export default {
  async create (invitation) {
    return convert((await axios.post('/api/invitations/', invitation)).data)
  },

  async get (invitationId) {
    return convert((await axios.get(`/api/invitations/${invitationId}/`)).data)
  },

  async list () {
    return convert((await axios.get('/api/invitations/')).data)
  },

  async listByGroupId (groupId) {
    if (groupId === 'undefined' || groupId === null) {
      throw new Error('groupId is undefined')
    }
    return convert((await axios.get('/api/invitations/', { params: { group: groupId } })).data)
  },

  async accept (token) {
    return (await axios.post(`/api/invitations/${token}/accept/`)).data
  },
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    return {
      ...val,
      expiresAt: new Date(val.expiresAt),
      createdAt: new Date(val.createdAt),
    }
  }
}
