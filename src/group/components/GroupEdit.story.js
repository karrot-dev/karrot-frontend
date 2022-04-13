import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'

import GroupEdit from './GroupEdit'

import { groupsMock, timezones } from '>/mockdata'

const methods = {
  save: action('save group'),
}

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

storiesOf('GroupEdit', module)
  .add('create', () => defaults({
    store,
    render: h => h(GroupEdit, {
      props: {
        value: groupsMock[0],
        status: statusMocks.default(),
        timezones,
        allGroups: groupsMock,
        requestError () {},
      },
      on: { save: methods.save },
    }),
  }))
