import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import LatestMessageItem from './LatestMessageItem'

import { messagesMock, usersMock, pickupsMock } from '>/mockdata'

const on = {
  open: action('open'),
}

const message = messagesMock[0]
const user = usersMock[0]
const pickup = pickupsMock[0]
const application = {
  user,
}
const thread = {
  content: 'here is the message that started the thread',
}

storiesOf('Latest Messages', module)
  .add('flag: muted', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        user,
        message,
        muted: true,
      },
      on,
    }),
  }))
  .add('flag: unread', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        user,
        message,
        unreadCount: 1,
      },
      on,
    }),
  }))
  .add('flag: unread+muted', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        user,
        message,
        unreadCount: 1,
        muted: true,
      },
      on,
    }),
  }))
  .add('type: private chat', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        user,
        message,
      },
      on,
    }),
  }))
  .add('type: pickup chat', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        pickup,
        message,
      },
      on,
    }),
  }))
  .add('type: application chat', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        application,
        message,
      },
      on,
    }),
  }))
  .add('type: thread', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        thread,
        message,
      },
      on,
    }),
  }))
