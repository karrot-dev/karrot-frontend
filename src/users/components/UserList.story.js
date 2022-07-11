<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

=======
import { h } from 'vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'

import * as factories from '>/enrichedFactories'

const datastore = createDatastore({
  users: { getters: { get: () => id => id } },
})

import UserList from './UserList'

const users = [...Array(15).keys()].map((_, i) => factories.makeUser({
  membership: factories.makeMembership({
    active: i < 10,
  }),
}))
const group = factories.makeGroup()

const defaultOn = {
  onCreateTrust: action('create trust'),
  onDetail: action('open detail sidebar'),
  onSelectGroup: action('select group'),
}

storiesOf('UserList', module)
  .add('default', () => defaults({
    render: () => h(UserList, {
      users,
      group,
      ...defaultOn,
    }),
    store: datastore,
  }))
