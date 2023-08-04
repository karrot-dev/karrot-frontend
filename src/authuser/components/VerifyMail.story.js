import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { storybookDefaults as defaults } from '>/helpers'
import { statusMocks } from '>/statusMocks'

import VerifyMail from './VerifyMail.vue'

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
