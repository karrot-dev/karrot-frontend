import { storiesOf } from '@storybook/vue'

import VerifyMail from './VerifyMail.vue'
import i18n from '@/i18n'

storiesOf('VerifyMail', module)
  .add('waiting', () => ({
    components: { VerifyMail },
    template: `<VerifyMail :status="status" user="user" />`,
    data () {
      return {
        status: {
          isWaiting: true,
          success: false,
          error: null,
        },
        user: {
          email: 'my@email.com',
        },
      }
    },
    i18n,
  }))
  .add('success', () => ({
    components: { VerifyMail },
    template: `<VerifyMail :status="status" user="user" />`,
    data () {
      return {
        status: {
          isWaiting: false,
          success: true,
          error: null,
        },
        user: {
          email: 'my@email.com',
        },
      }
    },
    i18n,
  }))
  .add('error', () => ({
    components: { VerifyMail },
    template: `<VerifyMail :status="status" user="user" />`,
    data () {
      return {
        status: {
          isWaiting: false,
          success: false,
          error: { data: 'this error is returned by the server' },
        },
        user: {
          email: 'my@email.com',
        },
      }
    },
    i18n,
  }))
