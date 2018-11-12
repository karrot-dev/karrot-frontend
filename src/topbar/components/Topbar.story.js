import { storiesOf } from '@storybook/vue'

import KBreadcrumb from './KBreadcrumb'
import Search from './Search'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, storesMock, usersMock } from '>/mockdata'

const datastore = createDatastore({
  groups: { getters: { all: () => groupsMock } },
  stores: { getters: { all: () => storesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/topbar/datastore/search').default,
})

storiesOf('General Components', module)

  .add('KBreadcrumb', () => defaults({
    render: h => h(KBreadcrumb, {
      props: {
        breadcrumbs: [{ name: 'Foodsharing Berlin' }, { name: 'SirPlus' }],
      },
    }),
  }))

  .add('Search', () => defaults({
    render: h => h(Search),
    store: datastore,
  }))
