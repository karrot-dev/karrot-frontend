import { nextTick } from 'vue'

import ConversationCompose from './ConversationCompose'
import ChatConversation from './ChatConversation'
import { createDatastore, mountWithDefaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

import { QInput } from 'quasar'
import { flushPromises } from '@vue/test-utils'
import cloneDeep from 'clone-deep'

const defaultProps = data => ({
  currentUser: factories.makeCurrentUser(),
  conversation: factories.makeConversation({
    unreadMessageCount: 1,
  }),
  away: false,
  ...data,
})

const datastore = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

describe('ChatConversation', () => {
  beforeEach(() => jest.resetModules())
  it('can send a message', async () => {
    const propsData = defaultProps({
      compose: true,
    })
    const wrapper = mountWithDefaults(ChatConversation, { datastore, propsData })
    // let the mounted() hook run
    await nextTick()

    expect(wrapper.findAllComponents(QInput).length).toBe(1)
    expect(wrapper.findAllComponents(ConversationCompose).length).toBe(1)

    const content = 'A nice new message'

    // Would be nicer to directly put the message into the QInput but did not find a way yet
    wrapper.findComponent(ConversationCompose).setData({ message: { content } })
    wrapper.findComponent(ConversationCompose).vm.submit()

    const { id } = propsData.conversation
    expect(wrapper.emitted().send).toEqual([[{ id, content, images: [] }]])
  })

  it('marks new messages as read', async () => {
    const propsData = defaultProps()
    const { conversation } = propsData
    conversation.unreadMessageCount = 0
    const wrapper = mountWithDefaults(ChatConversation, { datastore, propsData })
    await flushPromises()

    const { id } = conversation
    const updatedConversation = cloneDeep(conversation)
    updatedConversation.unreadMessageCount = 1
    updatedConversation.messages.push({ id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    await wrapper.setProps({ conversation: updatedConversation })

    expect(wrapper.emitted().mark).toEqual([[{ id, seenUpTo: 99 }]])
  })

  it('does not mark new messages as read when away', async () => {
    const propsData = { ...defaultProps(), away: true }
    const wrapper = mountWithDefaults(ChatConversation, { datastore, propsData })
    await nextTick()

    const { id, messages } = propsData.conversation
    messages.splice(0, 0, { id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    expect(wrapper.emitted().mark).toBeUndefined()
  })

  it('marks messages as read when returning from away', async () => {
    const propsData = { ...defaultProps(), away: true }
    const wrapper = mountWithDefaults(ChatConversation, { datastore, propsData })
    await flushPromises()

    const { conversation } = propsData
    const { id } = conversation
    const updatedConversation = cloneDeep(conversation)
    updatedConversation.messages.push({ id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    await wrapper.setProps({ conversation: updatedConversation })
    expect(wrapper.emitted().mark).toBeUndefined()

    await wrapper.setProps({ away: false })
    expect(wrapper.emitted().mark).toEqual([[{ id, seenUpTo: 99 }]])
  })
})
