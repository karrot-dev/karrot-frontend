import { storiesOf } from '@storybook/vue'
import store from '@/store'
import i18n from '@/i18n'

import Settings from '@/pages/Settings'

storiesOf('Settings Page', module)
  .add('Default', () => ({
    components: { Settings },
    template: '<Settings></Settings>',
    data () {
      return { }
    },
    i18n,
    store,
  }))
