import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PasswordReset from './PasswordReset'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

const methods = {
  reset: action('send reset request'),
}

storiesOf('Password Reset', module)
  .add('empty', () => defaults({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.default(),
        success: false,
      },
      on: {
        submit: methods.reset,
      },
    }),
  }))
  .add('pending', () => defaults({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.pending(),
        success: false,
      },
      on: {
        submit: methods.reset,
      },
    }),
  }))
  .add('success', () => defaults({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.default(),
        success: true,
      },
      on: {
        submit: methods.reset,
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(PasswordReset, {
      props: {
        status: statusMocks.validationError('email', 'some error'),
        success: false,
      },
      on: {
        submit: methods.reset,
      },
    }),
  }))
