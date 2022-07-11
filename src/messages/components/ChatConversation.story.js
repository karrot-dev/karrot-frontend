<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

import ChatConversation from './ChatConversation'
import * as factories from '>/enrichedFactories'
import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'
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

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

storiesOf('ChatConversation', module)
  .add('default', () => defaults({
    store,
    render: () => h(ChatConversation, defaultProps()),
  }))
  .add('fetching past', () => defaults({
    store,
    render: () => h(ChatConversation, defaultProps({
      conversation: {
        ...conversation,
        fetchPastStatus: statusMocks.pending(),
      },
    })),
  }))
  .add('closed', () => defaults({
    store,
    render: () => h(ChatConversation, defaultProps({
      conversation: {
        ...conversation,
        isClosed: true,
      },
    })),
  }))
  .add('not participant', () => defaults({
    store,
    render: () => h(ChatConversation, defaultProps({
      conversation: {
        ...conversation,
        isParticipant: false,
      },
    })),
  }))
  .add('thread', () => defaults({
    store,
    render: () => h(ChatConversation, defaultProps({
      conversation: thread,
    })),
  }))
  .add('message groups', () => defaults({
    store,
    render: () => {
      const timeDiff = new Date() - messagesMock[messagesMock.length - 1].createdAt.getTime()
      return h(ChatConversation, defaultProps({
        conversation: {
          ...conversation,
          messages: messagesMock.map(
            message => ({ ...message, createdAt: new Date(message.createdAt.getTime() + timeDiff) }),
          ),
        },
      }))
    },
  }))
