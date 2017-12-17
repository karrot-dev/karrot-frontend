import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Login from './Login'
import i18n from '@/i18n'
import { statusMocks } from '>/helpers'

storiesOf('Login', module)
  .add('empty', () => ({
    render: h => h(Login, {
      props: {
        status: statusMocks.default(),
      },
      on: {
        submit: action('login'),
      },
    }),
    i18n,
  }))
  .add('pending', () => ({
    render: h => h(Login, {
      props: {
        status: statusMocks.pending(),
      },
      on: {
        submit: action('login'),
      },
    }),
    i18n,
  }))
  .add('error', () => ({
    render: h => h(Login, {
      props: {
        status: statusMocks.validationError('email', 'is missing'),
      },
      on: {
        submit: action('login'),
      },
    }),
    i18n,
  }))
