<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { action } from '@storybook/addon-actions'

import PasswordReset from './RequestPasswordReset'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

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
