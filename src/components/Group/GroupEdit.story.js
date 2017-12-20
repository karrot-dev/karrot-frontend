import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import GroupEdit from './GroupEdit'

import { groupsMock, timezones as tzlist } from '>/mockdata'

const methods = {
  save: action('save group'),
}

const timezones = {
  field: 'value',
  list: tzlist.map(e => ({ value: e, label: e })),
}

storiesOf('GroupEdit', module)
  .add('create', () => defaults({
    render: h => h(GroupEdit, {
      props: {
        group: groupsMock[0],
        status: statusMocks.default(),
        timezones,
        allGroups: groupsMock,
        requestError () {},
      },
      on: { save: methods.save },
    }),
  }))
