import Wall from './Wall'
import WallMessage from './WallMessage'
import WallInput from './WallInput'

import { messagesMock, currentUserMock } from '>/mockdata'

import { QInput } from 'quasar'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

const defaultProps = {
  messages: [],
  fetchMoreMessages: jest.fn(),
  sendStatus: { isWaiting: false },
  messageReceiveStatus: { success: true },
  currentUser: currentUserMock,
}

polyfillRequestAnimationFrame()

describe('Wall', () => {
  it('renders', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: defaultProps,
    })
    expect(wrapper.element.className).toBe('wrapper')
    expect(wrapper.findAll(WallMessage).length).toBe(0)
  })

  it('renders messages', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: {
        ...defaultProps,
        messages: messagesMock,
      },
    })
    expect(wrapper.findAll(WallMessage).length).toBe(messagesMock.length)
  })

  it('can send a message', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: defaultProps,
    })
    expect(wrapper.findAll(QInput).length).toBe(1)
    expect(wrapper.findAll(WallInput).length).toBe(1)

    let message = 'A nice new wall message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.find(WallInput).setData({ message })
    wrapper.find('.q-if-control').trigger('click')
    expect(wrapper.emitted().send[0]).toEqual([message])
  })
})
