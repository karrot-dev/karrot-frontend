import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
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
  createTrust: action('create trust'),
  detail: action('open detail sidebar'),
  selectGroup: action('select group'),
}

storiesOf('UserList', module)
  .add('default', () => defaults({
    render: h => h(UserList, {
      props: {
        users,
        group,
      },
      on: defaultOn,
    }),
    store: datastore,
  }))
