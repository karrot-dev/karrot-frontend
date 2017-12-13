import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupItem from './PickupItem'
import i18n from '@/i18n'
import router from '@/router'
import { createStore } from '>/helpers'
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
  .add('Join', () => ({
    render: h => h(PickupItem, {
      props: {
        pickup: joinablePickup,
      },
      on: methods,
    }),
    i18n,
    store,
    router,
  }))
  .add('pending', () => ({
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
    i18n,
    store,
    router,
  }))
  .add('Full', () => ({
    render: h => h(PickupItem, {
      props: {
        pickup: fullPickup,
      },
      on: methods,
    }),
    i18n,
    store,
    router,
  }))
  .add('Leave', () => ({
    render: h => h(PickupItem, {
      props: {
        pickup: leavablePickup,
      },
      on: methods,
    }),
    i18n,
    store,
    router,
  }))
