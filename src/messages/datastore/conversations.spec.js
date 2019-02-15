const mockList = jest.fn()
jest.mock('@/messages/api/messages', () => ({
  list: mockList,
}))

import { createDatastore, statusMocks } from '>/helpers'

describe('conversations', () => {
  let datastore, oneHourAgo
  beforeEach(() => {
    jest.resetModules()
    const i18n = require('@/base/i18n').default
    i18n.locale = 'en'

    datastore = createDatastore({
      conversations: require('./conversations').default,
      users: { getters: { get: a => a => ({ id: a, displayName: `user ${a}` }) } },
    })

    oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)
  })
  describe('conversation update', () => {
    let initialConversation
    beforeEach(async () => {
      mockList.mockReturnValueOnce([])
      initialConversation = { id: 1, updatedAt: oneHourAgo, participants: [] }
      await datastore.commit('conversations/setConversation', initialConversation)
    })

    it('updates the conversation', () => {
      const now = new Date()
      const newConversation = { id: 1, updatedAt: now, participants: [], notifications: 'all' }
      datastore.dispatch('conversations/updateConversation', newConversation)
      expect(datastore.getters['conversations/get'](newConversation.id)).toEqual({
        ...newConversation,
        messages: [],
        isParticipant: true,
        muted: false,
        canFetchPast: false,
        sendStatus: statusMocks.default(),
        fetchStatus: statusMocks.default(),
        fetchPastStatus: statusMocks.default(),
        markStatus: statusMocks.default(),
      })
    })

    it('does not update the conversation if data is old', () => {
      const old = new Date(oneHourAgo.valueOf())
      old.setHours(old.getHours() - 1)
      datastore.dispatch('conversations/updateConversation', { id: 1, updatedAt: old, participants: [], notifications: 'all' })
      expect(datastore.getters['conversations/get'](1)).toEqual({
        ...initialConversation,
        messages: [],
        isParticipant: true,
        muted: false,
        canFetchPast: false,
        sendStatus: statusMocks.default(),
        fetchStatus: statusMocks.default(),
        fetchPastStatus: statusMocks.default(),
        markStatus: statusMocks.default(),
      })
    })

    it('ignores unknown conversation updates', () => {
      datastore.dispatch('conversations/updateConversation', { id: 2, updatedAt: oneHourAgo, participants: [] })
      expect(datastore.getters['conversations/get'](2)).toMatchObject({})
    })
  })

  describe('message update', () => {
    let oneHourAgo, initialConversation
    beforeEach(async () => {
      oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      mockList.mockReturnValueOnce([])
      initialConversation = { id: 1, updatedAt: oneHourAgo, participants: [], notifications: 'all', group: 1 }
      await datastore.commit('conversations/setConversation', initialConversation)
    })

    it('receives new message', () => {
      const message = { id: 1, conversation: 1, author: 1, reactions: [] }
      datastore.dispatch('conversations/receiveMessage', message)
      expect(datastore.getters['conversations/get'](1).messages).toEqual([{
        ...message,
        author: datastore.getters['users/get'](message.author),
        isUnread: true,
        isEdited: false,
        saveStatus: statusMocks.default(),
        groupId: 1,
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
      const conversation = { id: 1, updatedAt: oneHourAgo, participants: [] }
      await datastore.commit('conversations/setConversation', conversation)
      await datastore.dispatch('conversations/receiveMessage', message)
    })

    it('groups reactions by name', () => {
      expect(datastore.getters['conversations/get'](1).messages[0].reactions).toEqual([{
        'message': 'user 1 and user 2 reacted with :tada:',
        'name': 'tada',
        'reacted': false,
        'users': [{ 'displayName': 'user 1', 'id': 1 }, { 'displayName': 'user 2', 'id': 2 }],
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
