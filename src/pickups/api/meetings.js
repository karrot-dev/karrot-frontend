import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {

  async create (meeting) {
    return convert((await axios.post('/api/events/meetings/', convertDateToRange(meeting))).data)
  },

  async get (id) {
    return convert((await axios.get(`/api/events/meetings/${id}/`)).data)
  },

  async list (filter) {
    const params = filter || { 'date_min': new Date() }
    const response = (await axios.get('/api/events/meetings/', { params })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async listByGroupId (groupId) {
    return this.list({ group: groupId, 'date_min': new Date() })
  },

  async listByPlaceId (placeId) {
    return this.list({ place: placeId, 'date_min': new Date() })
  },

  async save (meeting) {
    return convert((await axios.patch(`/api/events/meetings/${meeting.id}/`, convertDateToRange(meeting))).data)
  },

  async join (meetingId) {
    return convert((await axios.post(`/api/events/meetings/${meetingId}/add/`, {})).data)
  },

  async leave (meetingId) {
    return convert((await axios.post(`/api/events/meetings/${meetingId}/remove/`, {})).data)
  },

  async conversation (meetingId) {
    return convertConversation((await axios.get(`/api/events/meetings/${meetingId}/conversation/`)).data)
  },

}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    const result = { ...val }

    if (val.date) {
      result.date = new Date(val.date[0])
      result.dateEnd = new Date(val.date[1])
    }

    return result
  }
}

export function convertDateToRange (meeting) {
  const result = { ...meeting }
  if (meeting.date) {
    result.date = [meeting.date]
  }
  if (meeting.dateEnd) {
    if (!result.date) result.date = []
    result.date[1] = meeting.dateEnd
    delete result.dateEnd
  }
  return result
}
