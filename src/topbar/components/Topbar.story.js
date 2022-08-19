import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, placesMock, usersMock } from '>/mockdata'

import KBreadcrumb from './KBreadcrumb'
import Search from './Search'

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
