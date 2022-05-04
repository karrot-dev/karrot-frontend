import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
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
