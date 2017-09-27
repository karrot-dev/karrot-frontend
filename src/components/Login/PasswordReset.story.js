import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PasswordReset from './PasswordReset.vue'
import i18n from '@/i18n'

const methods = {
  reset: action('send reset request'),
}

storiesOf('Password Reset', module)
  .add('initial', () => ({
    components: { PasswordReset },
    template: `<PasswordReset @submit="reset" :status="status" />`,
    data () {
      return {
        status: {
          isWaiting: false,
          success: false,
          error: null,
        },
      }
    },
    i18n,
    methods,
  }))
  .add('waiting', () => ({
    components: { PasswordReset },
    template: `<PasswordReset @submit="reset" :status="status" />`,
    data () {
      return {
        status: {
          isWaiting: true,
          success: false,
          error: null,
        },
      }
    },
    i18n,
    methods,
  }))
  .add('success', () => ({
    components: { PasswordReset },
    template: `<PasswordReset @submit="reset" :status="status" />`,
    data () {
      return {
        status: {
          isWaiting: false,
          success: true,
          error: null,
        },
      }
    },
    i18n,
    methods,
  }))
  .add('error', () => ({
    components: { PasswordReset },
    template: `<PasswordReset @submit="reset" :status="status" />`,
    data () {
      return {
        status: {
          isWaiting: false,
          success: false,
          error: { data: 'error' },
        },
      }
    },
    i18n,
    methods,
  }))
