import { storiesOf } from '@storybook/vue'

import VerifyMail from './VerifyMail'
import i18n from '@/i18n'

storiesOf('VerifyMail', module)
  .add('waiting', () => ({
    render: h => h(VerifyMail, {
      props: {
        status: { error: null, isWaiting: true, success: false },
        user: { email: 'my@email.com' },
      },
    }),
    i18n,
  }))
  .add('success', () => ({
    render: h => h(VerifyMail, {
      props: {
        status: { error: null, isWaiting: false, success: true },
        user: { email: 'my@email.com' },
      },
    }),
    i18n,
  }))
  .add('error', () => ({
    render: h => h(VerifyMail, {
      props: {
        status: { error: { data: 'this error is returned by the server' }, isWaiting: false, success: false },
        user: { email: 'my@email.com' },
      },
    }),
    i18n,
  }))
