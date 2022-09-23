import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { storybookDefaults as defaults, statusMocks, createDatastore } from '>/helpers'
import { feedbackMock, activitiesMock } from '>/mockdata'

import ActivityFeedback from '../pages/ActivityFeedback'

import AmountBox from './AmountBox'
import AmountPicker from './AmountPicker'
import FeedbackItem from './FeedbackItem'
import FeedbackList from './FeedbackList'
import PlaceFeedback from './PlaceFeedback'

const range = n => [...Array(n).keys()]

const datastore = createDatastore({
  places: { getters: { activePlace: () => factories.makePlace({ statistics: factories.makePlaceStatistics() }) } },
  feedback: {
    getters: {
      byActivePlace: () => range(5).map(factories.makeFeedback),
      fetchStatus: () => statusMocks.default(),
      canFetchPast: () => false,
      fetchPastStatus: () => statusMocks.default(),
    },
  },
  activities: {
    getters: {
      feedbackPossibleByActivePlace: () => range(2).map(factories.makeActivity),
      fetchFeedbackPossibleStatus: () => statusMocks.default(),
    },
  },
  route: {
    getters: {
      query: () => ({ highlight: feedbackMock[1].id }),
    },
  },
})

storiesOf('Feedback', module)
  .add('AmountPicker', () => defaults({
    data () {
      return {
        value: 1,
      }
    },
    render () {
      return h(AmountPicker, {
        value: this.value,
        onInput: v => { this.value = v },
      })
    },
  }))
  .add('AmountBox', () => defaults({
    render: () => h(AmountBox, {
      amount: 20,
    }),
  }))
  .add('ActivityFeedback', () => defaults({
    render: () => h(ActivityFeedback, {
      activities: activitiesMock.map(activity => ({
        ...activity,
        participants: activity.participants.map(user => ({
          ...user,
          membership: {
            isEditor: true,
            trusted: true,
          },
        })),
      })),
      existingFeedback: feedbackMock,
      saveStatus: statusMocks.default(),
      fetchStatus: statusMocks.default(),
      seedId: 1,
    }),
  }))
  .add('FeedbackItem', () => defaults({
    render: () => h(FeedbackItem, {
      feedback: feedbackMock[0],
    }),
  }))
  .add('FeedbackList', () => defaults({
    render: () => h(FeedbackList, {
      feedback: feedbackMock,
      status: statusMocks.default(),
      highlight: feedbackMock[1].id,
    }),
  }))
  .add('PlaceFeedback', () => defaults({
    render: () => h(PlaceFeedback),
    store: datastore,
  }))
