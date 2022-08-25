import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import PasswordReset from './RequestPasswordReset'

const on = {
  onSubmit: action('send reset request'),
}

storiesOf('Password Reset', module)
  .add('empty', () => defaults({
    render: () => h(PasswordReset, {
      status: statusMocks.default(),
      success: false,
      ...on,
    }),
  }))
  .add('pending', () => defaults({
    render: () => h(PasswordReset, {
      status: statusMocks.pending(),
      success: false,
      ...on,
    }),
  }))
  .add('success', () => defaults({
    render: () => h(PasswordReset, {
      status: statusMocks.default(),
      success: true,
      ...on,
    }),
  }))
  .add('error', () => defaults({
    render: () => h(PasswordReset, {
      status: statusMocks.validationError('email', 'some error'),
      success: false,
      ...on,
    }),
  }))
