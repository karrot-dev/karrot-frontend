import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupUsers from './PickupUsers'
import { joinablePickup, leavablePickup, fullPickup, emptyPickup, currentUserMock } from '>/mockdata'
import { createDatastore, storybookDefaults as defaults, statusMocks } from '>/helpers'

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

storiesOf('PickupUsers', module)
  .add('joinable', () => defaults({
    render: h => h(PickupUsers, {
      props: {
        pickup: joinablePickup,
      },
      on: {
        join: action('join'),
      },
    }),
    store: datastore,
  }))
  .add('join pending', () => defaults({
    render: h => h(PickupUsers, {
      props: {
        pickup: {
          ...joinablePickup,
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
    render: h => h(PickupUsers, {
      props: {
        pickup: leavablePickup,
      },
      on: {
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
  .add('leavable (current first)', () => defaults({
    render: h => h(PickupUsers, {
      props: {
        pickup: {
          ...leavablePickup,
          collectors: [
            leavablePickup.collectors.find(c => c.isCurrentUser),
            ...leavablePickup.collectors.filter(c => !c.isCurrentUser),
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
    render: h => h(PickupUsers, {
      props: {
        pickup: {
          ...leavablePickup,
          collectors: [
            leavablePickup.collectors[0],
            leavablePickup.collectors.find(c => c.isCurrentUser),
            leavablePickup.collectors[1],
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
    render: h => h(PickupUsers, {
      props: {
        pickup: {
          ...leavablePickup,
          collectors: [
            leavablePickup.collectors[0],
            leavablePickup.collectors.find(c => c.isCurrentUser),
            leavablePickup.collectors[1],
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
    render: h => h(PickupUsers, {
      props: {
        pickup: {
          ...leavablePickup,
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
    render: h => h(PickupUsers, {
      props: {
        pickup: fullPickup,
      },
    }),
    store: datastore,
  }))
  .add('empty', () => defaults({
    render: h => h(PickupUsers, {
      props: {
        pickup: emptyPickup,
      },
      on: {
        join: action('join'),
      },
    }),
    store: datastore,
  }))
