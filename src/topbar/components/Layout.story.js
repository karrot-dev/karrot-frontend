import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, placesMock, usersMock, currentUserMock } from '>/mockdata'

import KTopbar from './KTopbar'

const datastore = createDatastore({
  about: { getters: { deployed: () => ({}) }, actions: { fetch () {} } },
  groups: {
    getters: {
      all: () => groupsMock,
      mine: () => groupsMock,
      isMemberGroups: () => groupsMock,
    },
  },
  places: { getters: { all: () => placesMock } },
  users: { getters: { all: () => usersMock } },
  search: require('@/topbar/datastore/search').default,
  breadcrumbs: { getters: { all: () => [] } },
  currentGroup: { getters: { value: () => ({}) } },
  auth: { getters: { user: () => currentUserMock } },
  i18n: { getters: { locale: () => 'en' } },
  presence: require('@/utils/datastore/presence').default,
  communityFeed: {
    getters: {
      unreadCount: () => 0,
      topics: () => [],
    },
  },
  connectivity: {
    getters: {
      connected: () => true,
      reconnecting: () => false,
    },
  },
  status: {
    getters: {
      unseenCount: () => 1,
      hasUnread: () => true,
      unseenNotificationCount: () => 1,
      hasUnreadConversationsOrThreads: () => true,
    },
  },
})

storiesOf('Layout', module)
  .add('KTopbar', () => defaults({
    render: () => h(KTopbar),
    store: datastore,
  }))
