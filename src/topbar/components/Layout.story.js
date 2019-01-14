import { storiesOf } from '@storybook/vue'

import KTopbar from './KTopbar'
import KFooter from '@/base/components/KFooter'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, storesMock, usersMock, currentUserMock } from '>/mockdata'

const datastore = createDatastore({
  about: { getters: { deployed: () => ({}) }, actions: { fetch () {} } },
  groups: { getters: { all: () => groupsMock } },
  stores: { getters: { all: () => storesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/topbar/datastore/search').default,
  breadcrumbs: { getters: { all: () => [] } },
  currentGroup: { getters: { value: () => ({}) } },
  auth: { getters: { user: () => currentUserMock } },
  i18n: { getters: { locale: () => 'en' } },
  presence: require('@/utils/datastore/presence').default,
  loadingprogress: { getters: { active: () => false, closing: () => false } },
  communityFeed: {
    getters: {
      unreadCount: () => 0,
      topics: () => [],
    },
  },
  latestMessages: {
    getters: {
      unreadCount: () => 1,
      allUnreadMuted: () => false,
    },
  },
  notifications: {
    getters: {
      unseenCount: () => 1,
    },
  },
  connectivity: {
    getters: {
      connected: () => true,
    },
  },
})

storiesOf('Layout', module)
  .add('KTopbar', () => defaults({
    render: h => h(KTopbar),
    store: datastore,
  }))
  .add('KFooter', () => defaults({
    render: h => h(KFooter),
    store: datastore,
  }))
