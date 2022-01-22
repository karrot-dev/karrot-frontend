import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import LoginUser from './LoginUser'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

storiesOf('Login', module)
  .add('empty', () => defaults({
    render: h => h(LoginUser, {
      props: {
        status: statusMocks.default(),
      },
      on: {
        submit: action('login'),
      },
    }),
  }))
  .add('pending', () => defaults({
    render: h => h(LoginUser, {
      props: {
        status: statusMocks.pending(),
      },
      on: {
        submit: action('login'),
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(LoginUser, {
      props: {
        status: statusMocks.validationError('email', 'is missing'),
      },
      on: {
        submit: action('login'),
      },
    }),
  }))
