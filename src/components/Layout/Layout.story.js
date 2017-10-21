import { storiesOf } from '@storybook/vue'

import KTopbarUI from './KTopbarUI.vue'
import KFooter from './KFooter.vue'
import i18n from '@/i18n'

storiesOf('Layout', module)
  .add('KTopbar', () => ({
    render: h => h(KTopbarUI),
    i18n,
  }))
  .add('KFooter', () => ({
    render: h => h(KFooter),
    i18n,
  }))
