import { storiesOf } from '@storybook/vue'
import store from '@/store'
import i18n from '@/i18n'

import Settings from '@/pages/Settings'
import { usersMock } from '>/mockdata'

storiesOf('Settings Page', module)
  .add('Default', () => ({
    render (h) {
      return h(Settings)
    },
    created () {
      store.commit('auth/Receive Login Status', { user: usersMock[0] })
    },
    i18n,
    store,
  }))
