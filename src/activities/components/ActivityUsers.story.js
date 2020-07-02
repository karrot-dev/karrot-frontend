import { storiesOf } from '@storybook/vue'
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
    render: h => h(ActivityUsers, {
      props: {
        activity: joinableActivity,
      },
      on: {
        join: action('join'),
      },
    }),
    store: datastore,
  }))
  .add('join pending', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: {
          ...joinableActivity,
          joinStatus: statusMocks.pending(),
        },
      },
      on: {
        join: action('join'),
      },
    }),
    store: datastore,
  }))
  .add('leavable (current last)', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: leavableActivity,
      },
      on: {
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
  .add('leavable (current first)', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: {
          ...leavableActivity,
          participants: [
            leavableActivity.participants.find(c => c.isCurrentUser),
            ...leavableActivity.participants.filter(c => !c.isCurrentUser),
          ],
        },
      },
      on: {
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
  .add('leavable (current middle)', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: {
          ...leavableActivity,
          participants: [
            leavableActivity.participants[0],
            leavableActivity.participants.find(c => c.isCurrentUser),
            leavableActivity.participants[1],
          ],
        },
      },
      on: {
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
  .add('leave pending (middle)', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: {
          ...leavableActivity,
          participants: [
            leavableActivity.participants[0],
            leavableActivity.participants.find(c => c.isCurrentUser),
            leavableActivity.participants[1],
          ],
          leaveStatus: statusMocks.pending(),
        },
      },
      on: {
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
  .add('has started', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: {
          ...leavableActivity,
          hasStarted: true,
        },
      },
      on: {
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
  .add('full', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: fullActivity,
      },
    }),
    store: datastore,
  }))
  .add('empty', () => defaults({
    render: h => h(ActivityUsers, {
      props: {
        activity: emptyActivity,
      },
      on: {
        join: action('join'),
      },
    }),
    store: datastore,
  }))
