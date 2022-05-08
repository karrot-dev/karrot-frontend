import { QBtn } from 'quasar'

import { createDatastore, useMobileUserAgent } from '>/helpers'
import * as factories from '>/enrichedFactories'

const propsData = {
  conversation: factories.makeConversation(),
}

const datastore = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

describe('Detail', () => {
  beforeEach(() => jest.resetModules())

  let mountWithDefaults
  beforeEach(() => {
    // require() improves isolation
    // otherwise we get "$attrs is readonly" warnings
    mountWithDefaults = require('>/helpers').mountWithDefaults
  })

  it('can be closed', () => {
    const wrapper = mountWithDefaults(require('./DetailHeaderUI').default, { datastore, propsData })
    const closeButton = [...wrapper.findAllComponents(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    closeButton.trigger('click')
    expect(wrapper.emitted().close).toEqual([[]])
  })

  it('cannot be closed on mobile', () => {
    useMobileUserAgent()
    const wrapper = mountWithDefaults(require('./DetailHeaderUI').default, { datastore, propsData })
    const closeButton = [...wrapper.findAllComponents(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    expect(closeButton).toBeUndefined()
  })

  it('reverses messages if conversation is not a thread', () => {
    const wrapper = mountWithDefaults(require('./DetailUI').default, { datastore, propsData })
    const reversedMessageIds = [...propsData.conversation.messages.map(({ id }) => id)].reverse()
    const renderedMessageIds = [...wrapper.vm.conversationWithMaybeReversedMessages.messages].map(({ id }) => id)
    expect(renderedMessageIds).toEqual(reversedMessageIds)
  })

  it('keeps message order if conversation is a thread', () => {
    const wrapper = mountWithDefaults(require('./DetailUI').default, {
      datastore,
      propsData: {
        ...propsData,
        conversation: {
          ...propsData.conversation,
          thread: 1,
        },
      },
    })
    const reversedMessageIds = [...propsData.conversation.messages.map(({ id }) => id)]
    const renderedMessageIds = [...wrapper.vm.conversationWithMaybeReversedMessages.messages].map(({ id }) => id)
    expect(renderedMessageIds).toEqual(reversedMessageIds)
  })
})
