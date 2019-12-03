import { storiesOf } from '@storybook/vue'

import Unsubscribe from './Unsubscribe'
import { storybookDefaults as defaults } from '>/helpers'

storiesOf('Unsubscribe', module)
  .add('conversation', () => defaults({
    render: h => h(Unsubscribe, {
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
    render: h => h(Unsubscribe, {
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
    render: h => h(Unsubscribe, {
      props: {
        hasError: true,
      },
    }),
  }))
  .add('success', () => defaults({
    render: h => h(Unsubscribe, {
      props: {
        hasSuccess: true,
      },
    }),
  }))
  .add('invalid token', () => defaults({
    render: h => h(Unsubscribe, {
      props: {
        hasInvalidToken: true,
      },
    }),
  }))
