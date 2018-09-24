import { QBtn } from 'quasar'

import DetailUI from './DetailUI'
import { mountWithDefaults, polyfillRequestAnimationFrame, useMobileUserAgent, statusMocks } from '>/helpers'
import { messagesMock } from '>/mockdata'

polyfillRequestAnimationFrame()

const propsData = {
  conversation: {
    id: 1,
    sendStatus: statusMocks.default(),
    fetchStatus: statusMocks.default(),
    fetchPastStatus: statusMocks.default(),
    messages: messagesMock,
  },
}

describe('Detail', () => {
  beforeEach(() => jest.resetModules())
  it('can be closed', () => {
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    const closeButton = [...wrapper.findAll(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    closeButton.trigger('click')
    expect(wrapper.emitted().close).toEqual([[]])
  })

  it('cannot be closed on mobile', () => {
    useMobileUserAgent()
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    const closeButton = [...wrapper.findAll(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    expect(closeButton).toBeUndefined()
  })

  it('reverses messages if conversation is not a thread', () => {
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    const reversedMessageIds = [...propsData.conversation.messages.map(({ id }) => id)].reverse()
    const renderedMessageIds = [...wrapper.vm.conversationWithMaybeReversedMessages.messages].map(({ id }) => id)
    expect(renderedMessageIds).toEqual(reversedMessageIds)
  })

  it('keeps message order if conversation is a thread', () => {
    const wrapper = mountWithDefaults(DetailUI, { propsData: {
      ...propsData,
      conversation: {
        ...propsData.conversation,
        thread: 1,
      },
    } })
    const reversedMessageIds = [...propsData.conversation.messages.map(({ id }) => id)]
    const renderedMessageIds = [...wrapper.vm.conversationWithMaybeReversedMessages.messages].map(({ id }) => id)
    expect(renderedMessageIds).toEqual(reversedMessageIds)
  })
})
