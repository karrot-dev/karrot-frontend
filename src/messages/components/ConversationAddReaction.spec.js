import ConversationAddReactionInner from './ConversationAddReactionInner'
import { mountWithDefaults } from '>/helpers'
import EmojiButton from './EmojiButton'

describe('Conversation message reactions', () => {
  beforeEach(() => jest.resetModules())
  let wrapper

  beforeEach(() => {
    wrapper = mountWithDefaults(ConversationAddReactionInner, {
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
