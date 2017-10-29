import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PasswordReset from './PasswordReset'
import i18n from '@/i18n'

const methods = {
  reset: action('send reset request'),
}

storiesOf('Password Reset', module)
  .add('empty', () => ({
    render: h => h(PasswordReset, {
      props: {
        status: { error: null, isWaiting: false, success: false },
      },
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
  .add('waiting', () => ({
    render: h => h(PasswordReset, {
      props: {
        status: { error: null, isWaiting: true, success: false },
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
        status: { error: null, isWaiting: false, success: true },
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
        status: { error: { data: 'some error' }, isWaiting: false, success: false },
      },
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
