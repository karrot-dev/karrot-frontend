import { storiesOf } from '@storybook/vue'

import KTopbarUI from './KTopbarUI.vue'
import KFooter from './KFooter.vue'
import i18n from '@/i18n'

storiesOf('Layout', module)
  .add('KTopbar', () => ({
    components: { KTopbarUI },
    template: '<div id="q-app"><KTopbarUI/></div>',
    i18n,
  }))
  .add('KFooter', () => ({
    components: { KFooter },
    template: '<div id="q-app"><KFooter/></div>',
    i18n,
  }))
