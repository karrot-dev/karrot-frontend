const mockList = jest.fn()
jest.mock('@/services/api/messages', () => ({
  list: mockList,
}))

import { createStore } from '>/helpers'

describe('conversations', () => {
  let store
  beforeEach(() => {
    store = createStore({
      conversations: require('./conversations').default,
      users: { getters: { get: a => a => a } },
    })
  })
  describe('conversation update', () => {
    let oneHourAgo, initialConversation
    beforeEach(async () => {
      oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      mockList.mockReturnValueOnce([])
      initialConversation = { id: 1, updatedAt: oneHourAgo }
      await store.dispatch('conversations/setActive', initialConversation)
    })

    it('updates the conversation', () => {
      const now = new Date()
      const newConversation = { id: 1, updatedAt: now }
      store.dispatch('conversations/updateConversation', newConversation)
      expect(store.getters['conversations/activeConversation']).toEqual(newConversation)
    })

    it('does not update the conversation if data is old', () => {
      const old = new Date(oneHourAgo.valueOf())
      old.setHours(old.getHours() - 1)
      store.dispatch('conversations/updateConversation', { id: 1, updatedAt: old })
      expect(store.getters['conversations/activeConversation']).toEqual(initialConversation)
    })

    it('ignores unknown conversation updates', () => {
      store.dispatch('conversations/updateConversation', { id: 2, updatedAt: oneHourAgo })
      expect(store.getters['conversations/activeConversation']).toEqual(initialConversation)
    })
  })

  describe('message update', () => {
    let oneHourAgo, initialConversation
    beforeEach(async () => {
      oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      mockList.mockReturnValueOnce([])
      initialConversation = { id: 1, updatedAt: oneHourAgo }
      await store.dispatch('conversations/setActive', initialConversation)
    })

    it('receives new message', () => {
      const message = { id: 1, conversation: 1, author: 1 }
      store.dispatch('conversations/receiveMessage', message)
      expect(store.getters['conversations/activeMessages']).toEqual([{ ...message, isUnread: true }])
    })
  })
})
