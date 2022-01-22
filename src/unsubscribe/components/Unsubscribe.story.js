import { storiesOf } from '@storybook/vue'

import UnsubscribeFromItem from './UnsubscribeFromItem'
import { storybookDefaults as defaults } from '>/helpers'

storiesOf('Unsubscribe', module)
  .add('conversation', () => defaults({
    render: h => h(UnsubscribeFromItem, {
      props: {
        tokenData: {
          conversationId: 1,
          notificationType: 'weekly_summary',
          groupId: 1,
          groupName: 'testgroup',
        },
      },
    }),
  }))
  .add('thread', () => defaults({
    render: h => h(UnsubscribeFromItem, {
      props: {
        tokenData: {
          threadId: 1,
          groupId: 1,
          groupName: 'testgroup',
        },
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(UnsubscribeFromItem, {
      props: {
        hasError: true,
      },
    }),
  }))
  .add('success', () => defaults({
    render: h => h(UnsubscribeFromItem, {
      props: {
        hasSuccess: true,
      },
    }),
  }))
  .add('invalid token', () => defaults({
    render: h => h(UnsubscribeFromItem, {
      props: {
        hasInvalidToken: true,
      },
    }),
  }))
