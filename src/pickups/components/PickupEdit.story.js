import { storiesOf } from '@storybook/vue'

import { statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const PickupEdit = () => require('./PickupEdit').default

const pickup = factories.makePickup()
const series = factories.makePickupSeries()

storiesOf('PickupEdit', module)
  .add('default', () => defaults({
    render (h) {
      return h(PickupEdit(), {
        props: {
          value: pickup,
          series,
          status: statusMocks.default(),
        },
      })
    },
  }))
  .add('disabled', () => defaults({
    render (h) {
      return h(PickupEdit(), {
        props: {
          value: {
            ...pickup,
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
      return h(PickupEdit(), {
        props: {
          value: {
            ...pickup,
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
      return h(PickupEdit(), {
        props: {
          value: {
            ...pickup,
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
      return h(PickupEdit(), {
        props: {
          value: pickup,
          series,
          status: statusMocks.pending(),
        },
      })
    },
  }))
  .add('error', () => defaults({
    render (h) {
      return h(PickupEdit(), {
        props: {
          value: pickup,
          series,
          status: statusMocks.validationError('date', 'Wrong time'),
        },
      })
    },
  }))
