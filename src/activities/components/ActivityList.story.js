<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
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
    render: () => h(ActivityList, {
      activities,
      filterActivityTypes: Object.values(factories.activityTypes),
      onJoin: action('join'),
      onLeave: action('leave'),
    }),
    store: datastore,
  }))
