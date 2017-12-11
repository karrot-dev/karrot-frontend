import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import deepmerge from 'deepmerge'

import Signup from './Signup'
import i18n from '@/i18n'

function getProps (override) {
  return deepmerge({
    status: { pending: false, validationErrors: {}, hasValidationErrors: false },
    prefillEmail: () => 'default@example.com',
  }, override || {})
}

storiesOf('Signup', module)
  .add('empty', () => ({
    render: h => h(Signup, {
      props: getProps(),
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))

  .add('waiting', () => ({
    render: h => h(Signup, {
      props: getProps({ status: { pending: true } }),
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))

  .add('error', () => ({
    render: h => h(Signup, {
      props: getProps({ status: { validationErrors: { email: [ 'some error' ], nonFieldErrors: [ 'some non field error' ] }, hasValidationErrors: true } }),
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))
