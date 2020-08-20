import WallConversation from './WallConversation'
import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'

import * as factories from '>/enrichedFactories'

import { QInput } from 'quasar'

import { mountWithDefaults } from '>/helpers'

const defaultProps = {
  data: factories.makeConversation(),
  user: factories.makeCurrentUser(),
  fetchPast: jest.fn(),
}

describe('WallConversation', () => {
  beforeEach(() => jest.resetModules())
  it('renders messages', () => {
    const wrapper = mountWithDefaults(WallConversation, {
      propsData: defaultProps,
    })
    expect(wrapper.findAllComponents(ConversationMessage).length).toBe(defaultProps.data.messages.length)
  })

  it('can send a message', () => {
    const wrapper = mountWithDefaults(WallConversation, {
      propsData: defaultProps,
    })
    expect(wrapper.findAllComponents(QInput).length).toBe(1)
    expect(wrapper.findAllComponents(ConversationCompose).length).toBe(1)

    const content = 'A nice new message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.findComponent(ConversationCompose).setData({ message: { content } })
    wrapper.findComponent(ConversationCompose).vm.submit()
    expect(wrapper.emitted().send[0]).toEqual([{ id: defaultProps.data.id, content, images: [] }])
  })
})
