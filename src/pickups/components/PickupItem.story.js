import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupItem from './PickupItem'
import { createDatastore, storybookDefaults as defaults, statusMocks } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const user = factories.makeCurrentUser()
const joinablePickup = factories.makePickup({
  maxCollectors: 4,
  collectors: range(3).map(factories.makeUser),
  isUserMember: false,
  isFull: false,
  isEmpty: false,
  description: 'You can join this pickup.',
})
const fullPickup = factories.makePickup({
  maxCollectors: 4,
  collectors: range(4).map(factories.makeUser),
  isUserMember: false,
  isFull: true,
  isEmpty: false,
  description: 'This pickup is already full.',
})
const leavablePickup = factories.makePickup({
  maxCollectors: 4,
  collectors: [
    ...range(2).map(factories.makeUser),
    user,
  ],
  isUserMember: true,
  isFull: true,
  isEmpty: false,
  description: 'You can leave this pickup.',
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

storiesOf('PickupItem', module)
  .add('join', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: joinablePickup,
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('joined', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: leavablePickup,
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('pending', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: {
          ...joinablePickup,
          joinStatus: statusMocks.pending(),
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('full', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: fullPickup,
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('disabled', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: {
          ...fullPickup,
          isDisabled: true,
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('started', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: {
          ...fullPickup,
          hasStarted: true,
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
