import { storiesOf } from '@storybook/vue'

import KTopbar from './KTopbar'
import KFooter from './KFooter'
import i18n from '@/i18n'
import router from '@/router'
import { createStore } from '>/helpers'
import { groupsMock, storesMock, usersMock, currentUserMock } from '>/mockdata'

const store = createStore({
  about: { actions: { fetch () {} } },
  groups: { getters: { all: () => groupsMock } },
  stores: { getters: { all: () => storesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/store/modules/search').default,
  breadcrumbs: { getters: { all: () => [] } },
  auth: { getters: { user: () => currentUserMock } },
  i18n: { getters: { locale: () => 'en' } },
})

storiesOf('Layout', module)
  .add('KTopbar', () => ({
    render: h => h(KTopbar),
    i18n,
    router,
    store,
  }))
  .add('KFooter', () => ({
    render: h => h(KFooter),
    i18n,
    store,
  }))
