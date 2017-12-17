import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Signup from './Signup'
import i18n from '@/i18n'
import { statusMocks } from '>/helpers'

const defaultProps = {
  prefillEmail: () => 'default@example.com',
}

storiesOf('Signup', module)
  .add('empty', () => ({
    render: h => h(Signup, {
      props: {
        ...defaultProps,
        status: statusMocks.default(),
      },
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))

  .add('pending', () => ({
    render: h => h(Signup, {
      props: {
        ...defaultProps,
        status: statusMocks.pending(),
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
        ...defaultProps,
        status: statusMocks.validationError('email', 'error message'),
      },
      on: {
        submit: action('signup'),
      },
    }),
    i18n,
  }))
