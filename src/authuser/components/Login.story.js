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

import Login from './Login'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

storiesOf('Login', module)
  .add('empty', () => defaults({
    render: () => h(Login, {
      status: statusMocks.default(),
      onSubmit: action('login'),
    }),
  }))
  .add('pending', () => defaults({
    render: () => h(Login, {
      status: statusMocks.pending(),
      onSubmit: action('login'),
    }),
  }))
  .add('error', () => defaults({
    render: () => h(Login, {
      status: statusMocks.validationError('email', 'is missing'),
      onSubmit: action('login'),
    }),
  }))
