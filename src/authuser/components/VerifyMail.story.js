// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { storiesOf } from '@storybook/vue'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import VerifyMail from './VerifyMail'

storiesOf('VerifyMail', module)
  .add('pending', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.pending(),
        success: false,
      },
    }),
  }))
  .add('success', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.default(),
        success: true,
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(VerifyMail, {
      props: {
        status: statusMocks.nonFieldError('this error is returned by the server'),
        success: false,
      },
    }),
  }))
