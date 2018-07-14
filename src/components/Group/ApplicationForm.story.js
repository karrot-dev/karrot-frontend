import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'

import ApplicationForm from './ApplicationForm'

storiesOf('ApplicationForm', module)
  .add('create', () => defaults({
    render: h => h(ApplicationForm, {
      props: {
        applicationAnswers: undefined,
      },
    }),
  }))
