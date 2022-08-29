import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { makeActivity, makeCurrentUser, makeUser, participantType } from '>/enrichedFactories'
import { createDatastore, storybookDefaults as defaults, statusMocks } from '>/helpers'

import ActivityItem from './ActivityItem'

const range = n => [...Array(n).keys()]

const roles = []

const user = makeCurrentUser()
const joinableActivity = makeActivity({
  maxParticipants: 4,
  participants: range(3).map(() => ({
    user: makeUser(),
    participantType,
  })),
  isUserMember: false,
  isFull: false,
  isEmpty: false,
  description: 'You can join this activity.',
})
const fullActivity = makeActivity({
  maxParticipants: 4,
  participants: range(4).map(() => ({
    user: makeUser(),
    participantType,
  })),
  isUserMember: false,
  isFull: true,
  isEmpty: false,
  description: 'This activity is already full.',
})
const leavableActivity = makeActivity({
  maxParticipants: 4,
  participants: [
    ...range(2).map(makeUser),
    user,
  ].map(user => ({
    user,
    participantType,
  })),
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
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

const on = {
  onJoin: action('join'),
  onLeave: action('leave'),
}

storiesOf('ActivityItem', module)
  .add('join', () => defaults({
    render: () => h(ActivityItem, {
      activity: joinableActivity,
      roles,
      ...on,
    }),
    store: datastore,
  }))
  .add('joined', () => defaults({
    render: () => h(ActivityItem, {
      activity: leavableActivity,
      roles,
      ...on,
    }),
    store: datastore,
  }))
  .add('pending', () => defaults({
    render: () => h(ActivityItem, {
      activity: {
        ...joinableActivity,
        joinStatus: statusMocks.pending(),
      },
      roles,
      ...on,
    }),
    store: datastore,
  }))
  .add('full', () => defaults({
    render: () => h(ActivityItem, {
      activity: fullActivity,
      roles,
      ...on,
    }),
    store: datastore,
  }))
  .add('disabled', () => defaults({
    render: () => h(ActivityItem, {
      activity: {
        ...fullActivity,
        isDisabled: true,
      },
      roles,
      ...on,
    }),
    store: datastore,
  }))
  .add('started', () => defaults({
    render: () => h(ActivityItem, {
      activity: {
        ...fullActivity,
        hasStarted: true,
      },
      roles,
      ...on,
    }),
    store: datastore,
  }))
