import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'

const ActivityEdit = () => require('./ActivityEdit').default

const activity = factories.makeActivity()
const series = factories.makeActivitySeries()

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

storiesOf('ActivityEdit', module)
  .add('default', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: activity,
        series,
        status: statusMocks.default(),
      })
    },
  }))
  .add('disabled', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: {
          ...activity,
          isDisabled: true,
        },
        series,
        status: statusMocks.default(),
      })
    },
  }))
  .add('with duration', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: {
          ...activity,
          hasDuration: true,
        },
        series,
        status: statusMocks.default(),
      })
    },
  }))
  .add('series changed', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: {
          ...activity,
          seriesMeta: {
            isMaxParticipantsChanged: true,
            isDescriptionChanged: true,
          },
        },
        series: {
          ...series,
          description: 'other',
          maxParticipants: 1,
        },
        status: statusMocks.default(),
      })
    },
  }))
  .add('pending', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: activity,
        series,
        status: statusMocks.pending(),
      })
    },
  }))
  .add('error', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: activity,
        series,
        status: statusMocks.validationError('date', 'Wrong time'),
      })
    },
  }))
