import { storiesOf } from '@storybook/vue'

import ChatConversation from './ChatConversation'
import * as factories from '>/enrichedFactories'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'
import { messagesMock } from '>/mockdata'

const conversation = factories.makeConversation()
const thread = factories.makeThread()

const defaultProps = data => ({
  currentUser: factories.makeUser(),
  conversation,
  away: false,
  startAtBottom: false,
  inline: false,
  ...data,
})

storiesOf('ChatConversation', module)
  .add('default', () => defaults({
    render: h => h(ChatConversation, {
      props: defaultProps(),
    }),
  }))
  .add('fetching past', () => defaults({
    render: h => h(ChatConversation, {
      props: defaultProps({
        conversation: {
          ...conversation,
          fetchPastStatus: statusMocks.pending(),
        },
      }),
    }),
  }))
  .add('closed', () => defaults({
    render: h => h(ChatConversation, {
      props: defaultProps({
        conversation: {
          ...conversation,
          isClosed: true,
        },
      }),
    }),
  }))
  .add('not participant', () => defaults({
    render: h => h(ChatConversation, {
      props: defaultProps({
        conversation: {
          ...conversation,
          isParticipant: false,
        },
      }),
    }),
  }))
  .add('thread', () => defaults({
    render: h => h(ChatConversation, {
      props: defaultProps({
        conversation: thread,
      }),
    }),
  }))
  .add('message groups', () => defaults({
    render: h => {
      const timeDiff = new Date() - messagesMock[messagesMock.length - 1].createdAt.getTime()
      return h(ChatConversation, {
        props: defaultProps({
          conversation: {
            ...conversation,
            messages: messagesMock.map(
              message => ({ ...message, createdAt: new Date(message.createdAt.getTime() + timeDiff) }),
            ),
          },
        }),
      })
    },
  }))
