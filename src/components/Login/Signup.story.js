import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Signup from './Signup'
import i18n from '@/i18n'

storiesOf('Signup', module)
  .add('empty', () => ({
    render: h => h(Signup, {
      props: {
        status: { error: null, isWaiting: false },
      },
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))

  .add('waiting', () => ({
    render: h => h(Signup, {
      props: {
        status: { error: null, isWaiting: true },
      },
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))

  .add('error', () => ({
    render: h => h(Signup, {
      props: {
        status: { error: 'some error', isWaiting: false },
      },
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))
