import { storiesOf } from '@storybook/vue'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import VerifyMail from './VerifyMail'

storiesOf('VerifyMail', module)
  .add('pending', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.pending(),
        success: false,
        user: { email: 'my@email.com' },
      },
    }),
  }))
  .add('success', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.default(),
        success: true,
        user: { email: 'my@email.com' },
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.nonFieldError('this error is returned by the server'),
        success: false,
        user: { email: 'my@email.com' },
      },
    }),
  }))
