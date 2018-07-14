import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import { groupsMock } from '>/mockdata'
import ApplicationForm from './ApplicationForm'

storiesOf('ApplicationForm', module)
  .add('create', () => defaults({
    render: h => h(ApplicationForm, {
      props: {
        value: groupsMock[0],
        allGroups: groupsMock,
      },
    }),
  }))
