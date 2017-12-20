import { storiesOf } from '@storybook/vue'

import KBox from './KBox'
import KBreadcrumb from './KBreadcrumb'
import Search from './Search'
import { createStore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, storesMock, usersMock } from '>/mockdata'

const store = createStore({
  groups: { getters: { all: () => groupsMock } },
  stores: { getters: { all: () => storesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/store/modules/search').default,
})

storiesOf('General Components', module)
  .add('KBox', () => defaults({
    render: h => h(KBox),
  }))

  .add('KBreadcrumb', () => defaults({
    render: h => h(KBreadcrumb, {
      props: {
        breadcrumbs: [{ name: 'Foodsharing Berlin' }, { name: 'SirPlus' }],
      },
    }),
  }))

  .add('Search', () => defaults({
    render: h => h(Search),
    store,
  }))
