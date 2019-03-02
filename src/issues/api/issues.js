import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {
  async create (data) {
    return convert((await axios.post(`/api/issues/`, data)).data)
  },

  async get (id) {
    return convert((await axios.get(`/api/issues/${id}/`)).data)
  },

  async list (filter) {
    const response = (await axios.get('/api/issues/', { params: filter })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
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
      votings: val.votings.map(convertVoting),
    }
  }
}

function convertVoting (val) {
  return {
    ...val,
    createdAt: new Date(val.createdAt),
    expiresAt: new Date(val.expiresAt),
  }
}
