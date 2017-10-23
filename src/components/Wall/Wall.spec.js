import Wall from './Wall.vue'
import WallMessage from './WallMessage.vue'
import WallInput from './WallInput.vue'

import { messagesMock } from '>/mockdata'

import { QInput } from 'quasar'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

polyfillRequestAnimationFrame()

describe('Wall', () => {
  it('renders', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: {
        messages: [],
        fetchMoreMessages: jest.fn(),
      },
    })
    expect(wrapper.element.className).toBe('wrapper')
    expect(wrapper.findAll(WallMessage).length).toBe(0)
  })

  it('renders messages', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: {
        messages: messagesMock,
        fetchMoreMessages: jest.fn(),
      },
    })
    expect(wrapper.findAll(WallMessage).length).toBe(messagesMock.length)
  })

  it('can send a message', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: {
        messages: [],
        fetchMoreMessages: jest.fn(),
      },
    })
    expect(wrapper.findAll(QInput).length).toBe(1)
    expect(wrapper.findAll(WallInput).length).toBe(1)

    let message = 'A nice new wall message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.find(WallInput).setData({ message })
    wrapper.find('.q-if-control').trigger('click')
    expect(wrapper.emitted().send[0]).toEqual([message])
  })

  it('can fetch more', () => {
    const fetchMoreMessages = jest.fn().mockImplementation(() => Promise.resolve())
    let wrapper = mountWithDefaults(Wall, {
      propsData: {
        messages: [],
        canLoadMore: true,
        fetchMoreMessages,
      },
    })
    wrapper.vm.loadMore(0, () => {})
    expect(fetchMoreMessages).toBeCalled()
  })
})
