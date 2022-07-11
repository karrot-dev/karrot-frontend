<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import VerifyMail from './VerifyMail'

storiesOf('VerifyMail', module)
  .add('pending', () => defaults({
    render: () => h(VerifyMail, {
      status: statusMocks.pending(),
      success: false,
    }),
  }))
  .add('success', () => defaults({
    render: () => h(VerifyMail, {
      status: statusMocks.default(),
      success: true,
    }),
  }))
  .add('error', () => defaults({
    render: () => h(VerifyMail, {
      status: statusMocks.nonFieldError('this error is returned by the server'),
      success: false,
    }),
  }))
