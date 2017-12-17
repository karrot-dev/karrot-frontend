import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PasswordReset from './PasswordReset'
import i18n from '@/i18n'
import { statusMocks } from '>/helpers'

const methods = {
  reset: action('send reset request'),
}

storiesOf('Password Reset', module)
  .add('empty', () => ({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.default(),
        success: false,
      },
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
  .add('pending', () => ({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.pending(),
        success: false,
      },
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
  .add('success', () => ({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.default(),
        success: true,
      },
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
  .add('error', () => ({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.validationError('email', 'some error'),
        success: false,
      },
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
