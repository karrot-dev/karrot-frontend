import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import AmountPicker from './AmountPicker'
import AmountBox from './AmountBox'
import PickupFeedback from './PickupFeedback'
import FeedbackList from './FeedbackList'
import { feedbackMock, storesMock, currentUserMock } from '>/mockdata'

import i18n from '@/i18n'
import router from '@/router'
import { createStore } from '>/helpers'

const store = createStore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

const amountPicker = `
<div style="padding: 2em">
  <AmountPicker/>
</div>
`

storiesOf('Statistics', module)
  .add('AmountPicker', () => ({
    components: { AmountPicker },
    template: amountPicker,
  }))
  .add('AmountBox', () => ({
    components: { AmountBox },
    template: '<div style="padding: 2em"><AmountBox :amount="20"/></div>',
  }))
  .add('PickupFeedback', () => ({
    components: { PickupFeedback },
    template: '<div style="padding: 2em"><PickupFeedback/></div>',
    i18n,
  }))
  .add('FeedbackList', () => ({
    render: h => h(FeedbackList, {
      props: {
        feedback: feedbackMock,
        store: storesMock[0],
      },
      on: {
        join: action('join'),
        leave: action('leave'),
      },
    }),
    i18n,
    router,
    store,
  }))
