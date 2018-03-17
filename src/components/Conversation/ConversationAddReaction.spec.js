import ConversationAddReaction from './ConversationAddReaction'
import { mountWithDefaults } from '>/helpers'
import EmojiButton from './EmojiButton'

describe('Conversation message reactions', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountWithDefaults(ConversationAddReaction, {
      propsData: {
        reacted: ['thumbsup'],
      },
    })
  })

  it('click emoji in menu adds own reaction (when reaction not present)', () => {
    const button = wrapper.findAll(EmojiButton).wrappers[1]
    button.trigger('click')

    expect(wrapper.emitted().toggle).toEqual([['laughing']])
  })

  it('emoji is not present when already reacted', () => {
    expect(wrapper.vm.whitelist).not.toContain('thumbsup')
  })
})
