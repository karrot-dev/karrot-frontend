import { storiesOf } from '@storybook/vue'
import { statusMocks } from '>/helpers'

import VerifyMail from './VerifyMail'
import i18n from '@/i18n'

storiesOf('VerifyMail', module)
  .add('pending', () => ({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.pending(),
        success: false,
        user: { email: 'my@email.com' },
      },
    }),
    i18n,
  }))
  .add('success', () => ({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.default(),
        success: true,
        user: { email: 'my@email.com' },
      },
    }),
    i18n,
  }))
  .add('error', () => ({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.nonFieldError('this error is returned by the server'),
        success: false,
        user: { email: 'my@email.com' },
      },
    }),
    i18n,
  }))
