import Vue from 'vue'
import { QBtn } from 'quasar'
import cloneDeep from 'clone-deep'

import ConversationMessage from '@/components/Conversation/ConversationMessage'
import ConversationCompose from '@/components/Conversation/ConversationCompose'
import DetailUI from './DetailUI'
import { mountWithDefaults, polyfillRequestAnimationFrame, useMobileUserAgent, statusMocks } from '>/helpers'

import { currentUserMock, messagesMock, leavablePickup } from '>/mockdata'
import { QInput } from 'quasar-framework/dist/quasar.mat.esm'

polyfillRequestAnimationFrame()

const defaultProps = () => ({
  user: cloneDeep(currentUserMock),
  pickup: cloneDeep(leavablePickup),
  conversation: {
    id: 50,
    messages: cloneDeep(messagesMock),
    sendStatus: statusMocks.default(),
    fetchStatus: statusMocks.default(),
    fetchPastStatus: statusMocks.default(),
    canFetchPast: false,
    unreadMessageCount: 1,
  },
  away: false,
})

describe('Detail', () => {
  beforeEach(() => jest.resetModules())
  it('can be closed', () => {
    const wrapper = mountWithDefaults(DetailUI, {
      propsData: defaultProps(),
    })
    const closeButton = [...wrapper.findAll(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    closeButton.trigger('click')
    expect(wrapper.emitted().close).toEqual([[]])
  })

  it('cannot be closed on mobile', () => {
    useMobileUserAgent()
    const wrapper = mountWithDefaults(DetailUI, {
      propsData: defaultProps(),
    })
    const closeButton = [...wrapper.findAll(QBtn)].find(btn => btn.vm.$props.icon === 'close')
    expect(closeButton).toBeUndefined()
  })

  it('shows messages in reverse order', () => {
    const propsData = defaultProps()
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    const reversedMessageIds = [...propsData.conversation.messages.map(({ id }) => id)].reverse()
    const renderedMessageIds = [...wrapper.findAll(ConversationMessage)].map(msg => msg.vm.$props.message.id)
    expect(renderedMessageIds).toEqual(reversedMessageIds)
  })

  it('can send a message', () => {
    const propsData = defaultProps()
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    expect(wrapper.findAll(QInput).length).toBe(1)
    expect(wrapper.findAll(ConversationCompose).length).toBe(1)

    let message = 'A nice new message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.find(ConversationCompose).setData({ message })
    wrapper.find('.q-if-control').trigger('click')

    const { id } = propsData.conversation
    expect(wrapper.emitted().send).toEqual([[{ id, content: message }]])
    expect(wrapper.emitted().mark).toEqual([[{ id, seenUpTo: 1 }]])
  })

  it('marks new messages as read', async () => {
    const propsData = defaultProps()
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    const { id, messages } = propsData.conversation
    messages.splice(0, 0, { id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    await Vue.nextTick()
    expect(wrapper.emitted().mark).toEqual([[{ id, seenUpTo: 99 }]])
  })

  it('does not mark new messages as read when away', async () => {
    const propsData = { ...defaultProps(), away: true }
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    const { id, messages } = propsData.conversation
    messages.splice(0, 0, { id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    await Vue.nextTick()
    expect(wrapper.emitted().mark).toBeUndefined()
  })

  it('marks messages as read when returning from away', async () => {
    const propsData = { ...defaultProps(), away: true }
    const wrapper = mountWithDefaults(DetailUI, { propsData })
    const { id, messages } = propsData.conversation
    messages.splice(0, 0, { id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    await Vue.nextTick()
    expect(wrapper.emitted().mark).toBeUndefined()
    wrapper.setProps({ away: false })
    expect(wrapper.emitted().mark).toEqual([[{ id, seenUpTo: 99 }]])
  })
})
