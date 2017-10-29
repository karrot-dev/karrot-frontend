import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupList from './PickupList'
import { pickupsMock, storesMock, currentUserMock } from '>/mockdata'
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

storiesOf('PickupList', module)
  .add('Default', () => ({
    render: h => h(PickupList, {
      props: {
        pickups: pickupsMock,
        store: storesMock[0],
      },
      on: {
        join: action('join'),
        leave: action('leave'),
      },
    }),
    i18n,
    router,
    store,
  }))
