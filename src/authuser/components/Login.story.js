import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import Login from './Login'

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
