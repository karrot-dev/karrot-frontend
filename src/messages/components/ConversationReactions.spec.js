import { QBtn } from 'quasar'

import { mountWithDefaults } from '>/helpers'
import { currentUserMock, usersMockWithoutCurrent } from '>/mockdata'

import MessageReactions from './ConversationReactions.vue'
import EmojiButton from './EmojiButton.vue'

describe.skip('Conversation message reactions', () => {
  let wrapper

  beforeEach(() => {
    vi.resetModules()
    wrapper = await mountWithDefaults(MessageReactions, {
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
    const [reactedButton, notReactedButton] = wrapper.findAllComponents(EmojiButton)
    expect(reactedButton.classes()).toContain('user-reacted')
    expect(notReactedButton.classes()).not.toContain('user-reacted')
  })
})
