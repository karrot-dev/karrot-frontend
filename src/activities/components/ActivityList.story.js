import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

import ActivityList from './ActivityList'

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
    render: () => h(ActivityList, {
      activities,
      filterActivityTypes: Object.values(factories.activityTypes),
      onJoin: action('join'),
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
