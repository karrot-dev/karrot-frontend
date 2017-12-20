import { storiesOf } from '@storybook/vue'

import KTopbar from './KTopbar'
import KFooter from './KFooter'
import { createStore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, storesMock, usersMock, currentUserMock } from '>/mockdata'

const store = createStore({
  about: { getters: { get: () => ({}) }, actions: { fetch () {} } },
  groups: { getters: { all: () => groupsMock } },
  stores: { getters: { all: () => storesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/store/modules/search').default,
  breadcrumbs: { getters: { all: () => [] } },
  auth: { getters: { user: () => currentUserMock } },
  i18n: { getters: { locale: () => 'en' } },
})

storiesOf('Layout', module)
  .add('KTopbar', () => defaults({
    render: h => h(KTopbar),
    store,
  }))
  .add('KFooter', () => defaults({
    render: h => h(KFooter),
    store,
  }))
