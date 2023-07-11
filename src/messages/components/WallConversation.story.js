import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { currentUserMock } from '>/mockdata'

import WallConversation from './WallConversation.vue'

const conversation = factories.makeConversation()

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

const defaultProps = (data) => ({
  data: conversation,
  user: currentUserMock,
  fetchPast: () => {},
  ...data,
})

storiesOf('WallConversation', module)
  .add('default', () => defaults({
    store,
    render: () => h(WallConversation, defaultProps()),
  }))
  .add('unread', () => defaults({
    store,
    render: () => h(WallConversation, defaultProps({
      data: {
        ...conversation,
        unreadMessageCount: 1,
        isParticipant: true,
      },
    })),
  }))
