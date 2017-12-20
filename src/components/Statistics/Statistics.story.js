import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import AmountPicker from './AmountPicker'
import AmountBox from './AmountBox'
import PickupFeedback from './PickupFeedback'
import FeedbackItem from './FeedbackItem'
import FeedbackList from './FeedbackList'
import { usersMock, feedbackMock, storesMock } from '>/mockdata'

import i18n from '@/i18n'
import router from '@/router'

const amountPicker = `
<div style="padding: 2em">
  <AmountPicker/>
</div>
`

storiesOf('Statistics', module)
  .add('AmountPicker', () => defaults({
    components: { AmountPicker },
    template: amountPicker,
  }))
  .add('AmountBox', () => defaults({
    components: { AmountBox },
    template: '<div><AmountBox :amount="20"/></div>',
  }))
  .add('PickupFeedback', () => defaults({
    components: { PickupFeedback },
    template: '<div style="padding: 2em"><PickupFeedback/></div>',
  }))
  .add('FeedbackItem', () => ({
    render: h => h(FeedbackItem, {
      props: {
        members: usersMock,
        store: storesMock[0],
        feedback: feedbackMock[0],
      },
    }),
    i18n,
    router,
  }))
  .add('FeedbackList', () => ({
    render: h => h(FeedbackList, {
      props: {
        feedback: feedbackMock,
        store: storesMock[0],
      },
    }),
    i18n,
    router,
  }))
