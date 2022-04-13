import { storiesOf } from '@storybook/vue'

import ConversationMessage from './ConversationMessage'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

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
    render: h => h(ConversationMessage, {
      props: {
        message,
      },
    }),
  }))
  .add('edited', () => defaults({
    store,
    render: h => h(ConversationMessage, {
      props: {
        message: {
          ...message,
          isEdited: true,
        },
      },
    }),
  }))
  .add('via email', () => defaults({
    store,
    render: h => h(ConversationMessage, {
      props: {
        message: {
          ...message,
          receivedVia: 'email',
        },
      },
    }),
  }))
  .add('with unread replies', () => defaults({
    store,
    render: h => h(ConversationMessage, {
      props: {
        message: thread,
      },
    }),
  }))
  .add('with replies', () => defaults({
    store,
    render: h => h(ConversationMessage, {
      props: {
        message: {
          ...thread,
          threadMeta: {
            ...thread.threadMeta,
            unreadReplyCount: 0,
          },
        },
      },
    }),
  }))
  .add('with one image', () => defaults({
    store,
    render: h => h(ConversationMessage, {
      props: {
        message: {
          ...message,
          images: [
            factories.makeImage(),
          ],
        },
      },
    }),
  }))
  .add('with multiple images', () => defaults({
    store,
    render: h => h(ConversationMessage, {
      props: {
        message: {
          ...message,
          images: factories.makeImages(2, 10),
        },
      },
    }),
  }))
  .add('slim', () => defaults({
    store,
    render: h => h(ConversationMessage, {
      props: {
        message,
        slim: true,
      },
    }),
  }))
