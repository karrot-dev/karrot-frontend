import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import ActivityList from './ActivityList'
import { activitiesMock, placesMock, currentUserMock } from '>/mockdata'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

storiesOf('ActivityList', module)
  .add('Default', () => defaults({
    render: h => h(ActivityList, {
      props: {
        activities: activitiesMock,
        datastore: placesMock[0],
      },
      on: {
        join: action('join'),
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
