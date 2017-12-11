import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import deepmerge from 'deepmerge'

import PasswordReset from './PasswordReset'
import i18n from '@/i18n'

const methods = {
  reset: action('send reset request'),
}

function getProps (override) {
  return deepmerge({
    status: { pending: false, validationErrors: {}, hasValidationErrors: false },
    success: false,
  }, override || {})
}

storiesOf('Password Reset', module)
  .add('empty', () => ({
    render: h => h(PasswordReset, {
      props: getProps(),
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
  .add('waiting', () => ({
    render: h => h(PasswordReset, {
      props: getProps({ status: { pending: true } }),
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
  .add('success', () => ({
    render: h => h(PasswordReset, {
      props: getProps({ success: true }),
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
  .add('error', () => ({
    render: h => h(PasswordReset, {
      props: getProps({ status: { validationErrors: { email: [ 'some error' ], nonFieldErrors: [ 'some non field error' ] }, hasValidationErrors: true } }),
      on: {
        submit: methods.reset,
      },
    }),
    i18n,
  }))
