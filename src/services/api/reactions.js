import axios from '@/services/axios'

/**
 * Manage Emoji reactions of messages.
 */
export default {
  /**
   * Add a reaction to a message.
   * @param {string} messageId - id of the message
   * @param {string} name - emoji name
   */
  async create (messageId, name) {
    return (await axios.post(`/api/messages/${messageId}/reactions/`, { name })).data
  },

  /**
   * Remove a reaction from a message.
   * @param {string} messageId - id of the message
   * @param {string} name - emoji name
   */
  async remove (messageId, name) {
    return (await axios.delete(`/api/messages/${messageId}/reactions/${name}`)).data
  },
}
