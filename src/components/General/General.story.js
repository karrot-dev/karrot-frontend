import { storiesOf } from '@storybook/vue'

import KBox from './KBox'
import KBreadcrumb from './KBreadcrumb'
import Search from './Search'
import i18n from '@/i18n'
import { createStore } from '>/helpers'
import { groupsMock, storesMock, usersMock } from '>/mockdata'

const store = createStore({
  groups: { getters: { all: () => groupsMock } },
  stores: { getters: { all: () => storesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/store/modules/search').default,
})

storiesOf('General Components', module)
  .add('KBox', () => ({
    render: h => h(KBox),
    i18n,
  }))

  .add('KBreadcrumb', () => ({
    render: h => h(KBreadcrumb, {
      props: {
        breadcrumbs: [{ name: 'Foodsharing Berlin' }, { name: 'SirPlus' }],
      },
    }),
    i18n,
  }))

  .add('Search', () => ({
    render: h => h(Search),
    i18n,
    store,
  }))
