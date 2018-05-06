import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupList from './PickupList'
import { pickupsMock, storesMock, currentUserMock } from '>/mockdata'
import { createStore, storybookDefaults as defaults } from '>/helpers'

const store = createStore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

storiesOf('PickupList', module)
  .add('Default', () => defaults({
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
    store,
  }))
