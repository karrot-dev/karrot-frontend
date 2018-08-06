import axios from '@/services/axios'
import { convert as convertConversation } from '@/services/api/conversations'

export default {
  async create (data) {
    return convert((await axios.post('/api/groups/', data)).data)
  },

  async get (groupId) {
    return convert((await axios.get(`/api/groups/${groupId}/`)).data)
  },

  async save (group) {
    let groupId = group.id
    return convert((await axios.patch(`/api/groups/${groupId}/`, group)).data)
  },

  async join (groupId) {
    return (await axios.post(`/api/groups/${groupId}/join/`)).data
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

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    Object.values(val.memberships).forEach(convertMembership)
    return {
      ...val,
    }
  }
}

export function convertMembership (val) {
  val.createdAt = new Date(val.createdAt)
}
