import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Settings from '@/authuser/pages/Settings'
import VerificationWarning from '@/authuser/components/Settings/VerificationWarning'
import { currentUserMock, groupsMock } from '>/mockdata'

import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => currentUserMock,
      saveStatus: () => statusMocks.default(),
      changeEmailStatus: () => statusMocks.default(),
      changePasswordStatus: () => statusMocks.default(),
    },
    actions: {
      update: action('update'),
      changePassword: action('changePassword'),
      changeEmail: action('changeEmail'),
    },
    modules: {
      push: {
        namespaced: true,
        getters: {
          enabled: () => false,
          pending: () => false,
        },
      },
    },
  },
  currentGroup: {
    getters: {
      value: () => groupsMock[0]
    },
  },
  groups: {
    getters: {
      mine: () => groupsMock,
    },
  },
  users: {
    getters: {
      resendVerificationCodeStatus: () => statusMocks.default(),
      requestDeleteAccountStatus: () => statusMocks.default(),
      resendVerificationCodeSuccess: () => false,
    },
    actions: {
      resendVerification: action('resend'),
    },
  },
  i18n: {
    getters: {
      locale: () => 'en',
    },
  },
})

storiesOf('Settings Page', module)
  .add('Default', () => defaults({
    render (h) {
      return h(Settings)
    },
    store: datastore,
  }))
  .add('verification warning', () => defaults({
    render (h) {
      return h(VerificationWarning)
    },
    store: datastore,
  }))
