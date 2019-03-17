import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import * as factories from '>/enrichedFactories'

import LatestMessageItem from './LatestMessageItem'

import { messagesMock, usersMock, pickupsMock, groupsMock } from '>/mockdata'

const on = {
  open: action('open'),
}

const message = messagesMock[0]
const user = usersMock[0]
const group = groupsMock[0]
const pickup = pickupsMock[0]
const application = {
  user: {
    ...user,
    isCurrentUser: false,
  },
  group,
}
const myApplication = {
  user: {
    ...user,
    isCurrentUser: true,
  },
  group,
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
  .add('flag: closed', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        application,
        message,
        closed: true,
      },
      on,
    }),
  }))
  .add('flag: closed+muted', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        application,
        message,
        closed: true,
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
  .add('type: group wall', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        group,
        message,
      },
      on,
    }),
  }))
  .add('type: place wall', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        place: factories.makePlace(),
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
  .add('type: issue chat', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        issue: factories.makeIssue(),
        message,
      },
      on,
    }),
  }))
  .add('type: my application chat', () => defaults({
    render: h => h(LatestMessageItem, {
      props: {
        application: myApplication,
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
