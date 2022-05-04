import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'

const ActivityUsers = () => import('./ActivityUsers')
import { joinableActivity, leavableActivity, fullActivity, emptyActivity, currentUserMock } from '>/mockdata'
import { createDatastore, storybookDefaults as defaults, statusMocks } from '>/helpers'

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
      onJoin: action('join'),
    }),
    store: datastore,
  }))
  .add('leavable (current last)', () => defaults({
    render: () => h(ActivityUsers, {
      activity: leavableActivity,
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
  .add('leavable (current first)', () => defaults({
    render: () => h(ActivityUsers, {
      activity: {
        ...leavableActivity,
        participants: [
          leavableActivity.participants.find(c => c.isCurrentUser),
          ...leavableActivity.participants.filter(c => !c.isCurrentUser),
        ],
      },
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
          leavableActivity.participants.find(c => c.isCurrentUser),
          leavableActivity.participants[1],
        ],
      },
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
          leavableActivity.participants.find(c => c.isCurrentUser),
          leavableActivity.participants[1],
        ],
        leaveStatus: statusMocks.pending(),
      },
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
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
  .add('full', () => defaults({
    render: () => h(ActivityUsers, {
      activity: fullActivity,
    }),
    store: datastore,
  }))
  .add('empty', () => defaults({
    render: () => h(ActivityUsers, {
      activity: emptyActivity,
      onJoin: action('join'),
    }),
    store: datastore,
  }))
