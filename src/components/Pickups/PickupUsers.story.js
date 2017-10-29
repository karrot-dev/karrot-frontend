import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupUsers from './PickupUsers'
import { joinablePickup, leavablePickup, fullPickup, emptyPickup, currentUserMock } from '>/mockdata'
import i18n from '@/i18n'
import router from '@/router'
import { createStore } from '>/helpers'

const store = createStore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

storiesOf('PickupUsers', module)
  .add('joinable', () => ({
    render: h => h(PickupUsers, {
      props: {
        pickup: joinablePickup,
      },
      on: {
        join: action('join'),
      },
    }),
    i18n,
    router,
    store,
  }))
  .add('leavable', () => ({
    render: h => h(PickupUsers, {
      props: {
        pickup: leavablePickup,
      },
      on: {
        leave: action('leave'),
      },
    }),
    i18n,
    router,
    store,
  }))
  .add('full', () => ({
    render: h => h(PickupUsers, {
      props: {
        pickup: fullPickup,
      },
    }),
    i18n,
    router,
    store,
  }))
  .add('empty', () => ({
    render: h => h(PickupUsers, {
      props: {
        pickup: emptyPickup,
      },
      on: {
        join: action('join'),
      },
    }),
    i18n,
    router,
    store,
  }))
