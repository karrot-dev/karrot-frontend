import { storiesOf } from '@storybook/vue'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'
import { groupsMock } from '>/mockdata'
import ApplicationForm from './ApplicationForm'

storiesOf('ApplicationForm', module)
  .add('create', () => defaults({
    render: h => h(ApplicationForm, {
      props: {
        value: groupsMock[0],
        status: statusMocks.default(),
      },
    }),
  }))
