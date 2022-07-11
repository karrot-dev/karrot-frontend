<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT



import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

import KBreadcrumb from './KBreadcrumb'
import Search from './Search'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, placesMock, usersMock } from '>/mockdata'

const datastore = createDatastore({
  groups: { getters: { all: () => groupsMock } },
  places: { getters: { all: () => placesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/topbar/datastore/search').default,
})

storiesOf('Topbar', module)

  .add('KBreadcrumb', () => defaults({
    render: () => h(KBreadcrumb, {
      breadcrumbs: [{ name: 'Foodsharing Berlin' }, { name: 'SirPlus' }],
    }),
  }))

  .add('Search', () => defaults({
    render: () => h(Search),
    store: datastore,
  }))
