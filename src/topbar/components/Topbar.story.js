import { storiesOf } from '@storybook/vue'

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
