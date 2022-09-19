import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { createDatastore, storybookDefaults as defaults, statusMocks } from '>/helpers'
import {
  joinableActivity,
  leavableActivity,
  fullActivity,
  emptyActivity,
  currentUserMock,
  participantType,
} from '>/mockdata'

const ActivityUsers = () => import('./ActivityUsers')

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

storiesOf('ActivityUsers', module)
  .add('joinable', () => defaults({
    render: () => h(ActivityUsers, {
      activity: joinableActivity,
      participantType,
      onJoin: action('join'),
    }),
    store: datastore,
  }))
  .add('join pending', () => defaults({
    render: () => h(ActivityUsers, {
      activity: {
        ...joinableActivity,
        joinStatus: statusMocks.pending(),
      },
      participantType,
      onJoin: action('join'),
    }),
    store: datastore,
  }))
  .add('leavable (current last)', () => defaults({
    render: () => h(ActivityUsers, {
      activity: leavableActivity,
      participantType,
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
  .add('leavable (current first)', () => defaults({
    render: () => h(ActivityUsers, {
      activity: {
        ...leavableActivity,
        participants: [
          leavableActivity.participants.find(c => c.user.isCurrentUser),
          ...leavableActivity.participants.filter(c => !c.user.isCurrentUser),
        ],
      },
      participantType,
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
  .add('leavable (current middle)', () => defaults({
    render: () => h(ActivityUsers, {
      activity: {
        ...leavableActivity,
        participants: [
          leavableActivity.participants[0],
          leavableActivity.participants.find(c => c.user.isCurrentUser),
          leavableActivity.participants[1],
        ],
      },
      participantType,
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
  .add('leave pending (middle)', () => defaults({
    render: () => h(ActivityUsers, {
      activity: {
        ...leavableActivity,
        participants: [
          leavableActivity.participants[0],
          leavableActivity.participants.find(c => c.user.isCurrentUser),
          leavableActivity.participants[1],
        ],
        leaveStatus: statusMocks.pending(),
      },
      participantType,
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
  .add('has started', () => defaults({
    render: () => h(ActivityUsers, {
      activity: {
        ...leavableActivity,
        hasStarted: true,
      },
      participantType,
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
  .add('full', () => defaults({
    render: () => h(ActivityUsers, {
      activity: fullActivity,
      participantType,
    }),
    store: datastore,
  }))
  .add('empty', () => defaults({
    render: () => h(ActivityUsers, {
      activity: emptyActivity,
      participantType,
      onJoin: action('join'),
    }),
    store: datastore,
  }))
