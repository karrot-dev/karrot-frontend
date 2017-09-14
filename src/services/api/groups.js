import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/groups/', data)).data
  },

  async get (groupId) {
    return (await axios.get(`/api/groups/${groupId}/`)).data
  },

  async list () {
    await delay(1000)
    return (await axios.get('/api/groups/')).data
  },

  async listByMemberId (userId) {
    return (await axios.get('/api/groups/', { params: { members: userId } })).data
  },

  async listByGroupName (name) {
    return (await axios.get('/api/groups/', { params: { name: name } })).data
  },

  async search (query) {
    return axios.get('/api/groups/', { params: { search: query } })
  },

  async save (group) {
    let groupId = group.id
    return axios.patch(`/api/groups/${groupId}/`, group)
  },

  async join (groupId, data) {
    return axios.post(`/api/groups/${groupId}/join/`, data)
  },

  async leave (groupId) {
    return axios.post(`/api/groups/${groupId}/leave/`, {})
  },

  async timezones () {
    return axios.get('/api/groups/timezones/')
  },

  async conversation (groupId) {
    return axios.get(`/api/groups/${groupId}/conversation/`)
  }
}

function delay (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
