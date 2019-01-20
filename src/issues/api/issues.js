import axios from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {
  async get (id) {
    return convert((await axios.get(`/api/issues/${id}/`)).data)
  },

  async list (params) {
    return convert((await axios.get('/api/issues/', { params })).data)
  },

  async conversation (id) {
    return convertConversation((await axios.get(`/api/issues/${id}/conversation/`)).data)
  },

  async vote (id, listOfVotes) {
    await axios.post(`/api/issues/${id}/vote/`, listOfVotes)
  },

  async deleteVote (id) {
    await axios.delete(`/api/issues/${id}/vote/`)
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
    }
  }
}
