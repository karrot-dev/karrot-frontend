import { storiesOf } from '@storybook/vue'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import VerifyMail from './VerifyMail'

storiesOf('VerifyMail', module)
  .add('pending', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.pending(),
        success: false,
      },
    }),
  }))
  .add('success', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.default(),
        success: true,
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.nonFieldError('this error is returned by the server'),
        success: false,
      },
    }),
  }))
