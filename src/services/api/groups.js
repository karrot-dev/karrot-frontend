import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/groups/', data)).data
  },

  async get (groupId) {
    return (await axios.get(`/api/groups/${groupId}/`)).data
  },

  async list () {
    return (await axios.get('/api/groups/')).data
  },

  async listByMemberId (userId) {
    return (await axios.get('/api/groups/', { params: { members: userId } })).data
  },

  async listByGroupName (name) {
    return (await axios.get('/api/groups/', { params: { name: name } })).data
  },

  async search (query) {
    return (await axios.get('/api/groups/', { params: { search: query } })).data
  },

  async save (group) {
    let groupId = group.id
    return (await axios.patch(`/api/groups/${groupId}/`, group)).data
  },

  async join (groupId, data) {
    return (await axios.post(`/api/groups/${groupId}/join/`, data)).data
  },

  async leave (groupId) {
    return (await axios.post(`/api/groups/${groupId}/leave/`, {})).data
  },

  async timezones () {
    return (await axios.get('/api/groups/timezones/')).data
  },

  async conversation (groupId) {
    return (await axios.get(`/api/groups/${groupId}/conversation/`)).data
  },
}
