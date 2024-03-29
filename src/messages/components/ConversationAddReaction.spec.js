import { QBtn } from 'quasar'
import { vi } from 'vitest'

import { mountWithDefaults, nextTicks } from '>/helpers'

import ConversationAddReactionInner from './ConversationAddReactionInner.vue'
import EmojiButton from './EmojiButton.vue'

describe.skip('Conversation message reactions', () => {
  beforeEach(() => { vi.resetModules() })
  let wrapper

  beforeEach(async () => {
    wrapper = await mountWithDefaults(ConversationAddReactionInner, {
      propsData: {
        reacted: ['thumbsup'],
      },
    })
  })

  it('click emoji in menu adds own reaction (when reaction not present)', async () => {
    const button = wrapper.findComponent(EmojiButton).findComponent(QBtn)
    button.vm.click({})
    await nextTicks(2)

    expect(wrapper.emitted().toggle).toEqual([['carrot']])
  })

  it('changing search changes emoji displayed', () => {
    wrapper.setData({ search: 'pizza' })

    expect(wrapper.vm.results).toContain('pizza')
    expect(wrapper.vm.results).not.toContain('laughing')
  })

  it('searches with many results get truncated', () => {
    wrapper.setData({ search: 'man' })

    expect(wrapper.vm.results.length).toBe(20)
  })

  it('emoji is not present when already reacted', () => {
    expect(wrapper.vm.results).not.toContain('thumbsup')
  })
})
