import { QBtn } from 'quasar'

import { useMobileUserAgent } from '>/helpers'
import * as factories from '>/enrichedFactories'

const propsData = {
  conversation: factories.makeConversation(),
}

describe('Detail', () => {
  beforeEach(() => jest.resetModules())

  let mountWithDefaults
  beforeEach(() => {
    // require() improves isolation
    // otherwise we get "$listeners is readonly" and "$attrs is readonly" warnings
    mountWithDefaults = require('>/helpers').mountWithDefaults
  })

  it('can be closed', () => {
    const wrapper = mountWithDefaults(require('./DetailHeaderUI').default, { propsData })
    const closeButton = [...wrapper.findAll(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    closeButton.trigger('click')
    expect(wrapper.emitted().close).toEqual([[]])
  })

  it('cannot be closed on mobile', () => {
    useMobileUserAgent()
    const wrapper = mountWithDefaults(require('./DetailHeaderUI').default, { propsData })
    const closeButton = [...wrapper.findAll(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    expect(closeButton).toBeUndefined()
  })

  it('reverses messages if conversation is not a thread', () => {
    const wrapper = mountWithDefaults(require('./DetailUI').default, { propsData })
    const reversedMessageIds = [...propsData.conversation.messages.map(({ id }) => id)].reverse()
    const renderedMessageIds = [...wrapper.vm.conversationWithMaybeReversedMessages.messages].map(({ id }) => id)
    expect(renderedMessageIds).toEqual(reversedMessageIds)
  })

  it('keeps message order if conversation is a thread', () => {
    const wrapper = mountWithDefaults(require('./DetailUI').default, { propsData: {
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
