import Conversation from './Conversation'
import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'

import { messagesMock, currentUserMock } from '>/mockdata'

import { QInput } from 'quasar'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

const defaultProps = {
  data: {
    id: 12,
    messages: messagesMock,
    sendStatus: { pending: false },
    fetchStatus: { pending: false, hasValidationErrors: false },
    fetchPastStatus: { pending: false, hasValidationErrors: false },
    canFetchPast: false,
  },
  user: currentUserMock,
  fetchPast: jest.fn(),
}

polyfillRequestAnimationFrame()

describe('Conversation', () => {
  beforeEach(() => jest.resetModules())
  it('renders messages', () => {
    let wrapper = mountWithDefaults(Conversation, {
      propsData: defaultProps,
    })
    expect(wrapper.findAll(ConversationMessage).length).toBe(messagesMock.length)
  })

  it('can send a message', () => {
    let wrapper = mountWithDefaults(Conversation, {
      propsData: defaultProps,
    })
    expect(wrapper.findAll(QInput).length).toBe(1)
    expect(wrapper.findAll(ConversationCompose).length).toBe(1)

    let message = 'A nice new message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.find(ConversationCompose).setData({ message })
    wrapper.find('.q-if-control').trigger('click')
    expect(wrapper.emitted().send[0]).toEqual([{ id: defaultProps.data.id, content: message }])
  })
})
