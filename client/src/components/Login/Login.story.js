import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Login from './Login'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

storiesOf('Login', module)
  .add('empty', () => defaults({
    render: h => h(Login, {
      props: {
        status: statusMocks.default(),
      },
      on: {
        submit: action('login'),
      },
    }),
  }))
  .add('pending', () => defaults({
    render: h => h(Login, {
      props: {
        status: statusMocks.pending(),
      },
      on: {
        submit: action('login'),
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(Login, {
      props: {
        status: statusMocks.validationError('email', 'is missing'),
      },
      on: {
        submit: action('login'),
      },
    }),
  }))
