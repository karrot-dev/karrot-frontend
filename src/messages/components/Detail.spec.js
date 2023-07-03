import { QBtn } from 'quasar'
import { vi } from 'vitest'

import * as factories from '>/enrichedFactories'
import { createDatastore, useMobileUserAgent } from '>/helpers'

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

describe.skip('Detail', () => {
  beforeEach(() => { vi.resetModules() })

  let mountWithDefaults
  beforeEach(() => {
    // require() improves isolation
    // otherwise we get "$attrs is readonly" warnings
    mountWithDefaults = require('>/helpers').mountWithDefaults
  })

  it('can be closed', async () => {
    const wrapper = await mountWithDefaults((await import('./DetailHeaderUI')).default, { datastore, propsData })
    const closeButton = [...wrapper.findAllComponents(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    closeButton.trigger('click')
    expect(wrapper.emitted().close).toEqual([[]])
  })

  it('cannot be closed on mobile', async () => {
    useMobileUserAgent()
    const wrapper = await mountWithDefaults((await import('./DetailHeaderUI')).default, { datastore, propsData })
    const closeButton = [...wrapper.findAllComponents(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    expect(closeButton).toBeUndefined()
  })

  it('reverses messages if conversation is not a thread', async () => {
    const wrapper = await mountWithDefaults((await import('./DetailUI')).default, { datastore, propsData })
    const reversedMessageIds = [...propsData.conversation.messages.map(({ id }) => id)].reverse()
    const renderedMessageIds = [...wrapper.vm.conversationWithMaybeReversedMessages.messages].map(({ id }) => id)
    expect(renderedMessageIds).toEqual(reversedMessageIds)
  })

  it('keeps message order if conversation is a thread', async () => {
    const wrapper = await mountWithDefaults((await import('./DetailUI')).default, {
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
