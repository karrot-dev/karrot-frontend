// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'

import ConversationCompose from './ConversationCompose'
import ChatConversation from './ChatConversation'
import { createDatastore, mountWithDefaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

import { QInput } from 'quasar'

const defaultProps = data => ({
  currentUser: factories.makeCurrentUser(),
  conversation: factories.makeConversation({
    unreadMessageCount: 1,
  }),
  away: false,
  ...data,
})

const store = createDatastore({
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
    const wrapper = mountWithDefaults(ChatConversation, { store, propsData })
    // let the mounted() hook run
    await Vue.nextTick()

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
    const wrapper = mountWithDefaults(ChatConversation, { store, propsData })
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
    const wrapper = mountWithDefaults(ChatConversation, { store, propsData })
    await Vue.nextTick()

    const { id, messages } = propsData.conversation
    messages.splice(0, 0, { id: 99, author: 1, content: 'first messsage', conversation: id, createdAt: new Date() })
    expect(wrapper.emitted().mark).toBeUndefined()
  })

  it('marks messages as read when returning from away', async () => {
    const propsData = { ...defaultProps(), away: true }
    const wrapper = mountWithDefaults(ChatConversation, { store, propsData })
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
