import { storybookDefaults as defaults, statusMocks, createDatastore } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import AmountPicker from './AmountPicker'
import AmountBox from './AmountBox'
import ActivityFeedback from './ActivityFeedback'
import FeedbackItem from './FeedbackItem'
import FeedbackList from './FeedbackList'
import PlaceFeedback from './PlaceFeedback'

import { feedbackMock, placesMock, activitiesMock } from '>/mockdata'
import * as factories from '>/enrichedFactories'

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
      query: () => ({ highlight: feedbackMock[1].id })
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
    render (h) {
      return h(AmountPicker, {
        props: {
          value: this.value,
        },
        on: {
          input: v => { this.value = v },
        },
      })
    },
  }))
  .add('AmountBox', () => defaults({
    render: h => h(AmountBox, {
      props: {
        amount: 20,
      },
    }),
  }))
  .add('ActivityFeedback', () => defaults({
    render: h => h(ActivityFeedback, {
      props: {
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
        place: placesMock[0],
        status: statusMocks.default(),
        highlight: feedbackMock[1].id,
      },
    }),
  }))
  .add('PlaceFeedback', () => defaults({
    render: h => h(PlaceFeedback),
    store: datastore,
  }))
