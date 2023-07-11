import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { storybookDefaults as defaults } from '>/helpers'

import Unsubscribe from './Unsubscribe.vue'

storiesOf('Unsubscribe', module)
  .add('conversation', () => defaults({
    render: () => h(Unsubscribe, {
      tokenData: {
        conversationId: 1,
        notificationType: 'weekly_summary',
        groupId: 1,
        groupName: 'testgroup',
      },
    }),
  }))
  .add('thread', () => defaults({
    render: () => h(Unsubscribe, {
      tokenData: {
        threadId: 1,
        groupId: 1,
        groupName: 'testgroup',
      },
    }),
  }))
  .add('error', () => defaults({
    render: () => h(Unsubscribe, {
      hasError: true,
    }),
  }))
  .add('success', () => defaults({
    render: () => h(Unsubscribe, {
      hasSuccess: true,
    }),
  }))
  .add('invalid token', () => defaults({
    render: () => h(Unsubscribe, {
      hasInvalidToken: true,
    }),
  }))
