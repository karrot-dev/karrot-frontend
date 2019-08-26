import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import GroupEdit from './GroupEdit'

import { groupsMock, timezones } from '>/mockdata'

const methods = {
  save: action('save group'),
}

storiesOf('GroupEdit', module)
  .add('create', () => defaults({
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
