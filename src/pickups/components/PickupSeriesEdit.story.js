import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import { statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const PickupSeriesEdit = () => require('./PickupSeriesEdit').default

const series = factories.makePickupSeries()

storiesOf('PickupSeriesEdit', module)
  .add('weekly', () => defaults({
    render (h) {
      return h(PickupSeriesEdit(), {
        props: {
          value: series,
          status: statusMocks.default(),
        },
        on: {
          save (diff) {
            action('save', diff)
          },
        },
      })
    },
  }))
  .add('time error', () => defaults({
    render (h) {
      return h(PickupSeriesEdit(), {
        props: {
          value: series,
          status: statusMocks.validationError('startDate', 'time is in past'),
        },
      })
    },
  }))
  .add('duration', () => defaults({
    render (h) {
      return h(PickupSeriesEdit(), {
        props: {
          value: {
            ...series,
            duration: 45 * 60,
          },
          status: statusMocks.default(),
        },
      })
    },
  }))
  .add('custom rule', () => defaults({
    render (h) {
      return h(PickupSeriesEdit(), {
        props: {
          value: {
            ...series,
            rule: {
              ...series.rule,
              isCustom: true,
            },
          },
          status: statusMocks.default(),
        },
      })
    },
  }))
  .add('custom rule with duration', () => defaults({
    render (h) {
      return h(PickupSeriesEdit(), {
        props: {
          value: {
            ...series,
            duration: 45 * 60,
            rule: {
              ...series.rule,
              isCustom: true,
            },
          },
          status: statusMocks.default(),
        },
      })
    },
  }))
