import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
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
