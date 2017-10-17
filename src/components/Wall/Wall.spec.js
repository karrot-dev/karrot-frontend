import { createLocalVue, mount } from 'vue-test-utils'

import Wall from './Wall.vue'
import WallMessage from './WallMessage.vue'
import WallInput from './WallInput.vue'

import { messagesMock } from '>/mockdata'
import MockRouterLink from '>/MockRouterLink.vue'

import { QBtn, QInput } from 'quasar'

import i18n from '@/i18n'

describe('Wall', () => {
  let localVue

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.component('router-link', MockRouterLink)
    i18n.locale = 'en'
  })

  it('renders', () => {
    let wrapper = mount(Wall, {
      propsData: {
        messages: [],
      },
    })
    expect(wrapper.element.className).toBe('wrapper')
    expect(wrapper.findAll(WallMessage).length).toBe(0)
  })

  it('renders messages', () => {
    let wrapper = mount(Wall, {
      localVue,
      i18n,
      propsData: {
        messages: messagesMock,
      },
    })
    expect(wrapper.findAll(WallMessage).length).toBe(messagesMock.length)
  })

  it('can send a message', () => {
    let wrapper = mount(Wall, {
      localVue,
      i18n,
      propsData: {
        messages: [],
      },
    })
    expect(wrapper.findAll(QInput).length).toBe(1)
    expect(wrapper.findAll(QBtn).length).toBe(1)
    expect(wrapper.findAll(WallInput).length).toBe(1)

    let message = 'A nice new wall message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.find(WallInput).setData({ message })
    wrapper.find(QBtn).trigger('click')

    expect(wrapper.emitted().send[0]).toEqual([message])
  })

  it('can fetch more', () => {
    let wrapper = mount(Wall, {
      localVue,
      i18n,
      propsData: {
        messages: [],
      },
    })
    wrapper.find('button.more').trigger('click')
    expect(wrapper.emitted().fetchMoreMessages).toBeDefined()
  })
})
