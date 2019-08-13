import { storiesOf } from '@storybook/vue'
import Profile from '@/users/pages/Profile'
import TrustInfo from '@/users/components/TrustInfo'

import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const group = factories.makeGroup({
  isCurrentGroup: true,
  isMember: true,
})
const trustee = factories.makeUser()
const nonmember = factories.makeUserProfile()
const member = factories.makeUserProfile({
  mobileNumber: '123',
  address: 'New Street 1',
  description: 'this is a text **about me**',
  groups: [
    group,
    factories.makeGroup(),
    factories.makeGroup(),
  ],
  membership: factories.makeMembership({
    trustedBy: [trustee.id],
  }),
})

const datastore = options => createDatastore({
  users: {
    getters: {
      get: () => () => trustee,
      activeUser: () => options.activeUser,
    },
  },
  currentGroup: {
    getters: {
      value: () => group,
    },
  },
  history: {
    getters: {
      byCurrentGroupAndUser: () => [factories.makeHistory({
        group,
        users: [options.activeUser],
      })],
      fetchStatus: () => statusMocks.default(),
      canFetchPast: () => false,
      fetchPastStatus: () => statusMocks.default(),
    },
  },
  issues: {
    modules: {
      meta: {
        actions: {
          clear: () => null,
        },
      },
    },
    getters: {
      ongoing: () => [],
      createStatus: () => statusMocks.default(),
    },
  },
})

storiesOf('Profile', module)
  .add('non-member', () => defaults({
    render: h => h(Profile),
    store: datastore({
      activeUser: nonmember,
    }),
  }))
  .add('member', () => defaults({
    render: h => h(Profile),
    store: datastore({
      activeUser: member,
    }),
  }))
  .add('TrustInfo', () => defaults({
    render: h => h(TrustInfo),
  }))
