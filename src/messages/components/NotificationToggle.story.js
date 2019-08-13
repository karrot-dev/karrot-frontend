import { storiesOf } from '@storybook/vue'

import NotificationToggle from './NotificationToggle'
import { storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const user = factories.makeCurrentUser()
const unverifiedUser = factories.makeCurrentUser({ mailVerified: false })

storiesOf('NotificationToggle', module)
  .add('subscribed', () => defaults({
    render: h => h(NotificationToggle, {
      props: {
        muted: false,
        isParticipant: true,
        canUnsubscribe: true,
        user,
        inToolbar: false,
      },
    }),
  }))
  .add('subscribed - cannot unsubscribe', () => defaults({
    render: h => h(NotificationToggle, {
      props: {
        muted: false,
        isParticipant: true,
        canUnsubscribe: false,
        user,
        inToolbar: false,
      },
    }),
  }))
  .add('subscribed - toolbar mode', () => defaults({
    render: h => h(NotificationToggle, {
      props: {
        muted: false,
        isParticipant: true,
        canUnsubscribe: true,
        user,
        inToolbar: true,
      },
      class: 'bg-secondary',
    }),
  }))
  .add('subscribed - email not verified', () => defaults({
    render: h => h(NotificationToggle, {
      props: {
        muted: false,
        isParticipant: true,
        canUnsubscribe: true,
        user: unverifiedUser,
        inToolbar: false,
      },
    }),
  }))
  .add('muted', () => defaults({
    render: h => h(NotificationToggle, {
      props: {
        muted: true,
        isParticipant: true,
        canUnsubscribe: true,
        user,
        inToolbar: false,
      },
    }),
  }))
  .add('unsubscribed', () => defaults({
    render: h => h(NotificationToggle, {
      props: {
        muted: false,
        isParticipant: false,
        canUnsubscribe: true,
        user,
        inToolbar: false,
      },
    }),
  }))
