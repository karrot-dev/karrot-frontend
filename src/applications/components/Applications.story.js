<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { storybookDefaults as defaults, statusMocks, range } from '>/helpers'
import * as factories from '>/enrichedFactories'
import subDays from 'date-fns/subDays'

import ApplicationFormUI from './ApplicationFormUI'
import ApplicationList from './ApplicationList'

const group = factories.makeGroup()
const pending = range(3).map(() => factories.makeApplication())
const otherApplications = range(9).map(i => factories.makeApplication({
  status: ['accepted', 'declined', 'withdrawn'][i % 3],
  isPending: false,
  canDecide: false,
  createdAt: subDays(new Date(), 3),
  decidedBy: factories.makeUser(),
  decidedAt: subDays(new Date(), 1),
}))

storiesOf('Applications', module)
  .add('ApplicationForm', () => defaults({
    render: () => h(ApplicationFormUI, {
      group,
    }),
  }))
  .add('ApplicationList', () => defaults({
    render: () => h(ApplicationList, {
      pending,
      otherApplications,
      canFetchPast: false,
      fetchPastStatus: statusMocks.default(),
      fetchPast: () => {},
    }),
  }))
