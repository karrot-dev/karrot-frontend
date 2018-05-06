import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupSeriesEdit from './PickupSeriesEdit'
import { pickupSeriesMock } from '>/mockdata'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

storiesOf('PickupSeriesEdit', module)
  .add('Default', () => defaults({
    render (h) {
      return h(PickupSeriesEdit, {
        props: {
          value: pickupSeriesMock[0],
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
