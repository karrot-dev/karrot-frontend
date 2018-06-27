import { storybookDefaults as defaults, statusMocks } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import AmountPicker from './AmountPicker'
import AmountBox from './AmountBox'
import PickupFeedback from './PickupFeedback'
import FeedbackItem from './FeedbackItem'
import FeedbackList from './FeedbackList'
import { feedbackMock, storesMock, pickupsMock } from '>/mockdata'

storiesOf('Statistics', module)
  .add('AmountPicker', () => defaults({
    render: h => h(AmountPicker, {
      props: {
        value: 1,
      },
    }),
  }))
  .add('AmountBox', () => defaults({
    render: h => h(AmountBox, {
      props: {
        amount: 20,
      },
    }),
  }))
  .add('PickupFeedback', () => defaults({
    render: h => h(PickupFeedback, {
      props: {
        pickups: pickupsMock,
        existingFeedback: feedbackMock,
        saveStatus: statusMocks.default(),
        fetchStatus: statusMocks.default(),
      },
    }),
  }))
  .add('FeedbackItem', () => defaults({
    render: h => h(FeedbackItem, {
      props: {
        feedback: feedbackMock[0],
      },
    }),
  }))
  .add('FeedbackList', () => defaults({
    render: h => h(FeedbackList, {
      props: {
        feedback: feedbackMock,
        store: storesMock[0],
        status: statusMocks.default(),
      },
    }),
  }))
