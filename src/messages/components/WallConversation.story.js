import { h } from 'vue'
import { storiesOf } from '@storybook/vue'

import WallConversation from './WallConversation'
import { currentUserMock } from '>/mockdata'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

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
    render: () => h(WallConversation, {
      props: defaultProps(),
    }),
  }))
  .add('unread', () => defaults({
    store,
    render: () => h(WallConversation, {
      props: defaultProps({
        data: {
          ...conversation,
          unreadMessageCount: 1,
          isParticipant: true,
        },
      }),
    }),
  }))
