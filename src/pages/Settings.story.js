import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Settings from '@/pages/Settings'
import VerificationWarning from '@/components/Settings/VerificationWarning'
import { currentUserMock } from '>/mockdata'

import { createStore, statusMocks, storybookDefaults as defaults } from '>/helpers'

const store = createStore({
  auth: {
    getters: {
      user: () => currentUserMock,
      updateStatus: () => statusMocks.default(),
      changeEmailStatus: () => statusMocks.default(),
      changePasswordStatus: () => statusMocks.default(),
    },
    actions: {
      update: action('update'),
      changePassword: action('changePassword'),
      changeEmail: action('changeEmail'),
    },
  },
  users: {
    getters: {
      resendVerificationStatus: () => statusMocks.default(),
      resendVerificationSuccess: () => false,
    },
    actions: {
      resendVerification: action('resend'),
    },
  },
})

storiesOf('Settings Page', module)
  .add('Default', () => defaults({
    render (h) {
      return h(Settings)
    },
    store,
  }))
  .add('verification warning', () => defaults({
    render (h) {
      return h(VerificationWarning)
    },
    store,
  }))
