import MessageReactions from './ConversationReactions'
import { currentUserMock, usersMockWithoutCurrent } from '>/mockdata'
import { mountWithDefaults } from '>/helpers'

describe('Conversation message reactions', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountWithDefaults(MessageReactions, {
      propsData: {
        messageId: 5,
        user: currentUserMock,
        reactions: [
          { user: currentUserMock, name: 'heart' },
          { user: usersMockWithoutCurrent[0], name: 'tada' },
          { user: usersMockWithoutCurrent[1], name: 'tada' },
        ],
      },
    })
  })

  it('renders reactions', () => {
    expect(wrapper.findAll('.reaction-button').length).toEqual(2)
  })

  it('click reaction adds own reaction (when reaction not present)', () => {
    const button = wrapper.findAll('.reaction-button').wrappers[1]
    button.trigger('click')

    expect(wrapper.emitted().toggle).toBeTruthy()
    expect(wrapper.emitted().toggle).toEqual([[{ messageId: 5, name: 'tada' }]])
  })

  it('click reaction removes own reaction (when reaction present)', () => {
    const button = wrapper.findAll('.reaction-button').wrappers[0]
    button.trigger('click')

    expect(wrapper.emitted().toggle).toBeTruthy()
    expect(wrapper.emitted().toggle).toEqual([[{ messageId: 5, name: 'heart' }]])
  })

  it('click emoji in menu adds own reaction (when reaction not present)', () => {
    const button = wrapper.findAll('.reaction-menu-button').wrappers[4]
    button.trigger('click')

    expect(wrapper.emitted().toggle).toEqual([[{ messageId: 5, name: 'confused' }]])
  })

  it('click emoji in menu removes own reaction (when reaction present)', () => {
    const button = wrapper.findAll('.reaction-menu-button').wrappers[5]
    button.trigger('click')

    expect(wrapper.emitted().toggle).toEqual([[{ messageId: 5, name: 'heart' }]])
  })

  it('show whether user reacted (highlighting)', () => {
    const [ reactedButton, notReactedButton ] = wrapper.findAll('.reaction-button').wrappers
    expect(reactedButton.classes()).toContain('user-reacted')
    expect(notReactedButton.classes()).not.toContain('user-reacted')
  })

  // TODO test show how many users reacted, show who reacted in tooltip
})
