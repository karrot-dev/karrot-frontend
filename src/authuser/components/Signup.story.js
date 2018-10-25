import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Signup from './Signup'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

const defaultProps = {
  prefillEmail: () => 'default@example.com',
}

storiesOf('Signup', module)
  .add('empty', () => defaults({
    render: h => h(Signup, {
      props: {
        ...defaultProps,
        status: statusMocks.default(),
      },
      on: {
        submit: action('signup'),
      },
    }),
  }))

  .add('pending', () => defaults({
    render: h => h(Signup, {
      props: {
        ...defaultProps,
        status: statusMocks.pending(),
      },
      on: {
        submit: action('signup'),
      },
    }),
  }))

  .add('error', () => defaults({
    render: h => h(Signup, {
      props: {
        ...defaultProps,
        status: statusMocks.validationError('email', 'error message'),
      },
      on: {
        submit: action('signup'),
      },
    }),
  }))
