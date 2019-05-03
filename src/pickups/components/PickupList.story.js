import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupList from './PickupList'
import { pickupsMock, placesMock, currentUserMock } from '>/mockdata'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

const datastore = createDatastore({
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
        datastore: placesMock[0],
      },
      on: {
        join: action('join'),
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
