import { storiesOf } from '@storybook/vue'

import KTopbarUI from './KTopbarUI.vue'
import KFooter from './KFooter.vue'
import i18n from '@/i18n'
import router from '@/router'
import { createStore } from '>/helpers'

const store = createStore({
  about: {
    actions: { fetchAbout () {} },
  },
})

storiesOf('Layout', module)
  .add('KTopbar', () => ({
    render: h => h(KTopbarUI),
    i18n,
    router,
  }))
  .add('KFooter', () => ({
    render: h => h(KFooter),
    i18n,
    store,
  }))
