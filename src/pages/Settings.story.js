import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import i18n from '@/i18n'

import Settings from '@/pages/Settings'
import VerificationWarning from '@/components/Settings/VerificationWarning'
import { currentUserMock } from '>/mockdata'

import { createStore } from '>/helpers'

const store = createStore({
  auth: {
    getters: {
      user: () => currentUserMock,
      changeEmailStatus: () => ({ pending: false, validationErrors: {}, hasValidationErrors: false }),
      changePasswordStatus: () => ({ pending: false, validationErrors: {}, hasValidationErrors: false }),
    },
    actions: {
      update: action('update'),
      changePassword: action('changePassword'),
      changeEmail: action('changeEmail'),
    },
  },
  users: {
    getters: {
      resendVerificationStatus: () => ({ pending: false, validationErrors: {}, hasValidationErrors: false }),
      resendVerificationSuccess: () => false,
    },
    actions: {
      resendVerification: action('resend'),
    },
  },
})

storiesOf('Settings Page', module)
  .add('Default', () => ({
    render (h) {
      return h(Settings)
    },
    i18n,
    store,
  }))
  .add('verification warning', () => ({
    render (h) {
      return h(VerificationWarning)
    },
    i18n,
    store,
  }))
