import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupItem from './PickupItem'
import { createStore, storybookDefaults as defaults } from '>/helpers'
import { currentUserMock, joinablePickup, fullPickup, leavablePickup } from '>/mockdata'

const store = createStore({
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
    store,
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
    store,
  }))
  .add('Full', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: fullPickup,
      },
      on: methods,
    }),
    store,
  }))
  .add('Leave', () => defaults({
    render: h => h(PickupItem, {
      props: {
        pickup: leavablePickup,
      },
      on: methods,
    }),
    store,
  }))
