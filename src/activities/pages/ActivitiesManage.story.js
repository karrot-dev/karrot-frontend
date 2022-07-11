<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import ActivitiesManage from '@/activities/pages/ActivitiesManage'

import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const nonmember = factories.makeUserProfile()
const activitySeries = [factories.makeActivitySeries()]
const place = factories.makePlace()
const activities = range(5).map(() => factories.makeActivity())

const datastore = options => createDatastore({
  activitySeries: {
    getters: {
      byActivePlace: () => activitySeries,
      fetchListForActivePlaceStatus: () => statusMocks.default(),
      createStatus: () => statusMocks.default(),
    },
  },
  activities: {
    getters: {
      byActivePlace: () => activities,
      fetchingForCurrentGroup: () => false,
      createStatus: () => statusMocks.default(),
    },
  },
  activityTypes: {
    getters: {
      activeByCurrentGroup: () => Object.values(factories.activityTypes).filter(t => t.status === 'active'),
    },
  },
  places: {
    getters: {
      activePlaceId: () => place.id,
    },
  },
})

storiesOf('ActivitiesManage', module)
  .add('default', () => defaults({
    render: () => h(ActivitiesManage),
    store: datastore({
      activeUser: nonmember,
    }),
  }))
