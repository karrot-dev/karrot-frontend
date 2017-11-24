import Conversation from './Conversation'
import CMessage from './CMessage'
import Compose from './Compose'

import { messagesMock, currentUserMock } from '>/mockdata'

import { QInput } from 'quasar'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

const defaultProps = {
  data: {
    messages: messagesMock,
    sendStatus: { pending: false },
    fetchStatus: { pending: false, hasValidationErrors: false },
    fetchMoreStatus: { pending: false, hasValidationErrors: false },
    canLoadMore: false,
  },
  user: currentUserMock,
  fetchMore: jest.fn(),
}

polyfillRequestAnimationFrame()

describe('Conversation', () => {
  it('renders messages', () => {
    let wrapper = mountWithDefaults(Conversation, {
      propsData: defaultProps,
    })
    expect(wrapper.findAll(CMessage).length).toBe(messagesMock.length)
  })

  it('can send a message', () => {
    let wrapper = mountWithDefaults(Conversation, {
      propsData: defaultProps,
    })
    expect(wrapper.findAll(QInput).length).toBe(1)
    expect(wrapper.findAll(Compose).length).toBe(1)

    let message = 'A nice new message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.find(Compose).setData({ message })
    wrapper.find('.q-if-control').trigger('click')
    expect(wrapper.emitted().send[0]).toEqual([message])
  })
})
