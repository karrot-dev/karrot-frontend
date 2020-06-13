import { storiesOf } from '@storybook/vue'

import KTopbar from './KTopbar'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { groupsMock, placesMock, usersMock, currentUserMock } from '>/mockdata'

const datastore = createDatastore({
  about: { getters: { deployed: () => ({}) }, actions: { fetch () {} } },
  groups: { getters: {
    all: () => groupsMock,
    mine: () => groupsMock,
  } },
  places: { getters: { all: () => placesMock } },
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
  connectivity: {
    getters: {
      connected: () => true,
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
    render: h => h(KTopbar),
    store: datastore,
  }))
