import { throttle } from 'quasar'

import axios from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'
import { imageTypeToExtension } from '@/utils/utils'

async function markUserActive (groupId) {
  return axios.post(`/api/groups/${groupId}/mark_user_active/`)
}

const markUserActiveThrottles = {}

function getOrCreateMarkUserActiveThrottleFn (groupId) {
  if (!markUserActiveThrottles[groupId]) {
    markUserActiveThrottles[groupId] = throttle(
      async () => markUserActive(groupId),
      1000 * 60 * 10, // 10 minutes
    )
  }
  return markUserActiveThrottles[groupId]
}

async function throttledMarkUserActive (groupId) {
  const fn = getOrCreateMarkUserActiveThrottleFn(groupId)
  await fn()
}

export default {
  async create (data) {
    return convert((await axios.post('/api/groups/', data)).data)
  },

  async get (groupId) {
    return convert((await axios.get(`/api/groups/${groupId}/`)).data)
  },

  async save (group) {
    let data = group
    if (group.photo) {
      data = new FormData()
      const filename = ['photo', imageTypeToExtension(group.photo.type)].join('')
      data.append('photo', group.photo, filename)
    }

    const groupId = group.id
    return convert((await axios.patch(`/api/groups/${groupId}/`, data)).data)
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

  throttledMarkUserActive,

  addNotificationType (groupId, notificationType) {
    return axios.put(`/api/groups/${groupId}/notification_types/${notificationType}/`)
  },

  removeNotificationType (groupId, notificationType) {
    return axios.delete(`/api/groups/${groupId}/notification_types/${notificationType}/`)
  },

  trustUser (groupId, userId, role) {
    return axios.post(`/api/groups/${groupId}/users/${userId}/trust/`, { role })
  },

  revokeTrust (groupId, userId, role) {
    // passing data in delete(url, config)! luckily, the config object accepts a data property
    return axios.delete(`/api/groups/${groupId}/users/${userId}/trust/`, { data: { role } })
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
