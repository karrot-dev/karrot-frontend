import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

import ConversationMessage from './ConversationMessage'

const range = n => [...Array(n).keys()]

const message = factories.makeMessage({
  content: range(50).reduce(acc => acc + 'This is a test. ', ''),
  isEditable: true,
})
const thread = factories.makeThread()

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

storiesOf('ConversationMessage', module)
  .add('default', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message,
    }),
  }))
  .add('edited', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message: {
        ...message,
        isEdited: true,
      },
    }),
  }))
  .add('via email', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message: {
        ...message,
        receivedVia: 'email',
      },
    }),
  }))
  .add('with unread replies', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message: thread,
    }),
  }))
  .add('with replies', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message: {
        ...thread,
        threadMeta: {
          ...thread.threadMeta,
          unreadReplyCount: 0,
        },
      },
    }),
  }))
  .add('with one image', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message: {
        ...message,
        images: [
          factories.makeImage(),
        ],
      },
    }),
  }))
  .add('with multiple images', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message: {
        ...message,
        images: factories.makeImages(2, 10),
      },
    }),
  }))
  .add('slim', () => defaults({
    store,
    render: () => h(ConversationMessage, {
      message,
      slim: true,
    }),
  }))
