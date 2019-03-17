import Vue from 'vue'
import cloneDeep from 'clone-deep'

import ConversationCompose from './ConversationCompose'
import ChatConversation from './ChatConversation'
import { mountWithDefaults, polyfillRequestAnimationFrame, statusMocks } from '>/helpers'

import { currentUserMock, messagesMock } from '>/mockdata'
import { QInput } from 'quasar-framework/dist/quasar.mat.esm'

polyfillRequestAnimationFrame()

const defaultProps = data => ({
  currentUser: cloneDeep(currentUserMock),
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
  ...data,
})

describe('ChatConversation', () => {
  beforeEach(() => jest.resetModules())
  it('can send a message', async () => {
    const propsData = defaultProps({
      compose: true,
    })
    const wrapper = mountWithDefaults(ChatConversation, { propsData })
    // let the mounted() hook run
    await Vue.nextTick()

    expect(wrapper.findAll(QInput).length).toBe(1)
    expect(wrapper.findAll(ConversationCompose).length).toBe(1)

    let message = 'A nice new message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.find(ConversationCompose).setData({ message })
    wrapper.find('.q-if-control').trigger('click')

    const { id } = propsData.conversation
    expect(wrapper.emitted().send).toEqual([[{ id, content: message }]])
  })

  it('marks new messages as read', async () => {
    const propsData = defaultProps()
    const { conversation } = propsData
    conversation.unreadMessageCount = 0
    const wrapper = mountWithDefaults(ChatConversation, { propsData })
    await Vue.nextTick()

    const { id, messages } = conversation
    conversation.unreadMessageCount = 1
    messages.push({ id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })

    wrapper.setProps({ conversation: { ...conversation } })
    await Vue.nextTick()
    expect(wrapper.emitted().mark).toEqual([[{ id, seenUpTo: 99 }]])
  })

  it('does not mark new messages as read when away', async () => {
    const propsData = { ...defaultProps(), away: true }
    const wrapper = mountWithDefaults(ChatConversation, { propsData })
    await Vue.nextTick()

    const { id, messages } = propsData.conversation
    messages.splice(0, 0, { id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    expect(wrapper.emitted().mark).toBeUndefined()
  })

  it('marks messages as read when returning from away', async () => {
    const propsData = { ...defaultProps(), away: true }
    const wrapper = mountWithDefaults(ChatConversation, { propsData })
    await Vue.nextTick()

    const { id, messages } = propsData.conversation
    messages.push({ id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    wrapper.setProps({ conversation: { ...propsData.conversation } })
    await Vue.nextTick()
    expect(wrapper.emitted().mark).toBeUndefined()

    wrapper.setProps({ away: false })
    await Vue.nextTick()
    expect(wrapper.emitted().mark).toEqual([[{ id, seenUpTo: 99 }]])
  })
})
