import { h } from 'vue'
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
