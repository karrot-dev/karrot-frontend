import axios from '@/services/axios'
import { convert as convertConversation } from '@/services/api/conversations'

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
    return convertConversation((await axios.get(`/api/groups/${groupId}/conversation/`)).data)
  },

  async markUserActive (groupId) {
    return axios.post(`/api/groups/${groupId}/mark_user_active/`)
  },

  addNotificationType (groupId, notificationType) {
    return axios.put(`/api/groups/${groupId}/notification_types/${notificationType}/`)
  },

  removeNotificationType (groupId, notificationType) {
    return axios.delete(`/api/groups/${groupId}/notification_types/${notificationType}/`)
  },
}
