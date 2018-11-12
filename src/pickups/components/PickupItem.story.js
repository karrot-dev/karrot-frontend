import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupItem from './PickupItem'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { currentUserMock, joinablePickup, fullPickup, leavablePickup } from '>/mockdata'

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

const methods = {
  join: action('join'),
  leave: action('leave'),
}

storiesOf('PickupItem', module)
  .add('Join', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: joinablePickup,
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
          joinStatus: {
            ...joinablePickup.joinStatus,
            pending: true,
          },
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('Full', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: fullPickup,
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('Leave', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: leavablePickup,
      },
      on: methods,
    }),
    store: datastore,
  }))
