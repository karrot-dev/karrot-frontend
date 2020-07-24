import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import ActivityItem from './ActivityItem'
import { createDatastore, storybookDefaults as defaults, statusMocks } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const user = factories.makeCurrentUser()
const joinableActivity = factories.makeActivity({
  maxParticipants: 4,
  participants: range(3).map(factories.makeUser),
  isUserMember: false,
  isFull: false,
  isEmpty: false,
  description: 'You can join this activity.',
})
const fullActivity = factories.makeActivity({
  maxParticipants: 4,
  participants: range(4).map(factories.makeUser),
  isUserMember: false,
  isFull: true,
  isEmpty: false,
  description: 'This activity is already full.',
})
const leavableActivity = factories.makeActivity({
  maxParticipants: 4,
  participants: [
    ...range(2).map(factories.makeUser),
    user,
  ],
  isUserMember: true,
  isFull: true,
  isEmpty: false,
  description: 'You can leave this activity.',
})

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => user,
    },
  },
})

const methods = {
  join: action('join'),
  leave: action('leave'),
}

storiesOf('ActivityItem', module)
  .add('join', () => defaults({
    render: h => h(ActivityItem, {
      props: {
        activity: joinableActivity,
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('joined', () => defaults({
    render: h => h(ActivityItem, {
      props: {
        activity: leavableActivity,
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('pending', () => defaults({
    render: h => h(ActivityItem, {
      props: {
        activity: {
          ...joinableActivity,
          joinStatus: statusMocks.pending(),
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('full', () => defaults({
    render: h => h(ActivityItem, {
      props: {
        activity: fullActivity,
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('disabled', () => defaults({
    render: h => h(ActivityItem, {
      props: {
        activity: {
          ...fullActivity,
          isDisabled: true,
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('started', () => defaults({
    render: h => h(ActivityItem, {
      props: {
        activity: {
          ...fullActivity,
          hasStarted: true,
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
