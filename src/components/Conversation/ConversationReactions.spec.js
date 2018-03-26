import MessageReactions from './ConversationReactions'
import { currentUserMock, usersMockWithoutCurrent } from '>/mockdata'
import { mountWithDefaults } from '>/helpers'
import EmojiButton from './EmojiButton'

describe('Conversation message reactions', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountWithDefaults(MessageReactions, {
      propsData: {
        messageId: 5,
        reactions: [
          { users: [currentUserMock], name: 'heart', reacted: true },
          { users: usersMockWithoutCurrent.slice(0, 1), name: 'tada' },
        ],
      },
    })
  })

  it('renders reactions', () => {
    expect(wrapper.find('.reactions').findAll(EmojiButton).length).toEqual(2)
  })

  it('click reaction adds own reaction (when reaction not present)', () => {
    const button = wrapper.find('.reactions').findAll(EmojiButton).wrappers[1]
    button.trigger('click')

    expect(wrapper.emitted().toggle).toBeTruthy()
    expect(wrapper.emitted().toggle).toEqual([['tada']])
  })

  it('show whether user reacted (highlighting)', () => {
    const [ reactedButton, notReactedButton ] = wrapper.find('.reactions').findAll(EmojiButton).wrappers
    expect(reactedButton.classes()).toContain('user-reacted')
    expect(notReactedButton.classes()).not.toContain('user-reacted')
  })
})
