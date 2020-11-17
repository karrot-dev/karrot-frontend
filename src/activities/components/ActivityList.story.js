import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import ActivityList from './ActivityList'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const currentUser = factories.makeCurrentUser()
const activities = range(5).map(() => factories.makeActivity())

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => currentUser,
    },
  },
})

storiesOf('ActivityList', module)
  .add('Default', () => defaults({
    render: h => h(ActivityList, {
      props: {
        activities: activities,
        filterActivityTypes: Object.values(factories.activityTypes),
      },
      on: {
        join: action('join'),
        leave: action('leave'),
      },
    }),
    store: datastore,
  }))
