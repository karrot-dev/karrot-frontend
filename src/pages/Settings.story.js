import { storiesOf } from '@storybook/vue'
import store from '@/store'
import i18n from '@/i18n'

import Settings from '@/pages/Settings'
import { currentUserMock } from '>/mockdata'

storiesOf('Settings Page', module)
  .add('Default', () => ({
    render (h) {
      return h(Settings)
    },
    created () {
      store.commit('auth/Set User', { user: currentUserMock })
    },
    i18n,
    store,
  }))
