const mockList = jest.fn()
jest.mock('@/services/api/messages', () => ({
  list: mockList,
}))

import { createStore, statusMocks } from '>/helpers'

describe('conversations', () => {
  let store
  beforeEach(() => {
    jest.resetModules()
    const i18n = require('@/i18n').default
    i18n.locale = 'en'

    store = createStore({
      conversations: require('./conversations').default,
      users: { getters: { get: a => a => ({ id: a, displayName: `user ${a}` }) } },
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
      const message = { id: 1, conversation: 1, author: 1, reactions: [] }
      store.dispatch('conversations/receiveMessage', message)
      expect(store.getters['conversations/activeMessages']).toEqual([{
        ...message,
        author: store.getters['users/get'](message.author),
        isUnread: true,
        saveStatus: statusMocks.default(),
      }])
    })
  })

  describe('message reactions', () => {
    beforeEach(async () => {
      mockList.mockReturnValueOnce([])
      const message = {
        id: 1,
        conversation: 1,
        author: 1,
        reactions: [
          { name: 'tada', user: 1 },
          { name: 'tada', user: 2 },
        ],
      }
      await store.dispatch('conversations/receiveMessage', message)
      await store.commit('conversations/setActive', { conversationId: 1 })
    })

    it('groups reactions by name', () => {
      expect(store.getters['conversations/activeMessages'][0].reactions).toEqual([{
        'message': 'user 1 and user 2 reacted with :tada:',
        'name': 'tada',
        'reacted': false,
        'users': [{'displayName': 'user 1', 'id': 1}, {'displayName': 'user 2', 'id': 2}],
      }])
    })

    it('makes nice message about who reacted', () => {
      const readableReactionMessage = require('./conversations').readableReactionMessage
      expect(readableReactionMessage({
        users: [{ displayName: '', isCurrentUser: true }],
        name: 'thumbsup',
      })).toEqual('you reacted with :thumbsup:')

      expect(readableReactionMessage({
        users: [{ displayName: '', isCurrentUser: true }, { displayName: 'Hans' }],
        name: 'thumbsup',
      })).toEqual('you and Hans reacted with :thumbsup:')

      expect(readableReactionMessage({
        users: [{ displayName: 'Fritz' }, { displayName: 'Hans' }],
        name: 'thumbsup',
      })).toEqual('Fritz and Hans reacted with :thumbsup:')

      expect(readableReactionMessage({
        users: [{ displayName: 'Fritz' }, { displayName: 'Hans' }, { displayName: 'Peter' }],
        name: 'thumbsup',
      })).toEqual('Fritz, Hans and Peter reacted with :thumbsup:')

      expect(readableReactionMessage({
        users: [{ displayName: 'Hans' }, { displayName: '', isCurrentUser: true }, { displayName: 'Peter' }],
        name: 'thumbsup',
      })).toEqual('you, Hans and Peter reacted with :thumbsup:')

      expect(readableReactionMessage({
        users: [],
        name: 'thumbsup',
      })).toEqual('')
    })
  })
})
