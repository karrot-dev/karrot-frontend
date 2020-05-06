import MessageReactions from './ConversationReactions'
import { currentUserMock, usersMockWithoutCurrent } from '>/mockdata'
import { mountWithDefaults } from '>/helpers'
import EmojiButton from './EmojiButton'
import { QBtn } from 'quasar'

describe('Conversation message reactions', () => {
  let wrapper

  beforeEach(() => {
    jest.resetModules()
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
    expect(wrapper.findAllComponents(EmojiButton).length).toEqual(2)
  })

  it('click reaction adds own reaction (when reaction not present)', () => {
    const button = wrapper.findComponent(EmojiButton).findComponent(QBtn)
    button.vm.click({})

    expect(wrapper.emitted().toggle).toBeTruthy()
    expect(wrapper.emitted().toggle).toEqual([['heart']])
  })

  it('show whether user reacted (highlighting)', () => {
    const [reactedButton, notReactedButton] = wrapper.findAllComponents(EmojiButton).wrappers
    expect(reactedButton.classes()).toContain('user-reacted')
    expect(notReactedButton.classes()).not.toContain('user-reacted')
  })
})
