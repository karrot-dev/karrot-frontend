import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Login from './Login'
import i18n from '@/i18n'

storiesOf('Login', module)
  .add('empty', () => ({
    render: h => h(Login, {
      props: {
        status: { error: null, isWaiting: false },
      },
      on: {
        submit: action('login'),
      },
    }),
    i18n,
  }))
  .add('waiting', () => ({
    render: h => h(Login, {
      props: {
        status: { error: null, isWaiting: true },
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
        status: { error: { email: [ 'is missing' ], password: [ 'is wrong' ] }, isWaiting: false },
      },
      on: {
        submit: action('login'),
      },
    }),
    i18n,
  }))
