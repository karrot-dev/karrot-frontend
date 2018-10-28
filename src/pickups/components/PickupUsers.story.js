import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupUsers from './PickupUsers'
import { joinablePickup, leavablePickup, fullPickup, emptyPickup, currentUserMock } from '>/mockdata'
import { createStore, storybookDefaults as defaults } from '>/helpers'

const store = createStore({
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
    store,
  }))
  .add('leavable', () => defaults({
    render: h => h(PickupUsers, {
      props: {
        pickup: leavablePickup,
      },
      on: {
        leave: action('leave'),
      },
    }),
    store,
  }))
  .add('full', () => defaults({
    render: h => h(PickupUsers, {
      props: {
        pickup: fullPickup,
      },
    }),
    store,
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
    store,
  }))
