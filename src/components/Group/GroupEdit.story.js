import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupEdit from './GroupEdit.vue'
import i18n from '@/i18n'

import { groupsMock, timezones as tzlist } from '>/mockdata'

const methods = {
  save: action('save group'),
}

const timezones = {
  field: 'value',
  list: tzlist.map(e => ({ value: e, label: e })),
}

storiesOf('GroupEdit', module)
  .add('create', () => ({
    render: h => h(GroupEdit, {
      props: {
        group: groupsMock[0],
        status: { error: null, isWaiting: false },
        timezones,
        allGroups: groupsMock,
      },
      on: { save: methods.save },
    }),
    i18n,
  }))
