<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
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
    render: () => h(Profile),
    store: datastore({
      activeUser: nonmember,
    }),
  }))
  .add('member', () => defaults({
    render: () => h(Profile),
    store: datastore({
      activeUser: member,
    }),
  }))
  .add('TrustInfo', () => defaults({
    render: () => h(TrustInfo),
  }))
