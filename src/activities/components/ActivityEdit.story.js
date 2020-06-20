import { storiesOf } from '@storybook/vue'

import { statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const ActivityEdit = () => require('./ActivityEdit').default

const activity = factories.makeActivity()
const series = factories.makeActivitySeries()

storiesOf('ActivityEdit', module)
  .add('default', () => defaults({
    render (h) {
      return h(ActivityEdit(), {
        props: {
          value: activity,
          series,
          status: statusMocks.default(),
        },
      })
    },
  }))
  .add('disabled', () => defaults({
    render (h) {
      return h(ActivityEdit(), {
        props: {
          value: {
            ...activity,
            isDisabled: true,
          },
          series,
          status: statusMocks.default(),
        },
      })
    },
  }))
  .add('with duration', () => defaults({
    render (h) {
      return h(ActivityEdit(), {
        props: {
          value: {
            ...activity,
            hasDuration: true,
          },
          series,
          status: statusMocks.default(),
        },
      })
    },
  }))
  .add('series changed', () => defaults({
    render (h) {
      return h(ActivityEdit(), {
        props: {
          value: {
            ...activity,
            seriesMeta: {
              isMaxCollectorsChanged: true,
              isDescriptionChanged: true,
            },
          },
          series: {
            ...series,
            description: 'other',
            maxCollectors: 1,
          },
          status: statusMocks.default(),
        },
      })
    },
  }))
  .add('pending', () => defaults({
    render (h) {
      return h(ActivityEdit(), {
        props: {
          value: activity,
          series,
          status: statusMocks.pending(),
        },
      })
    },
  }))
  .add('error', () => defaults({
    render (h) {
      return h(ActivityEdit(), {
        props: {
          value: activity,
          series,
          status: statusMocks.validationError('date', 'Wrong time'),
        },
      })
    },
  }))
