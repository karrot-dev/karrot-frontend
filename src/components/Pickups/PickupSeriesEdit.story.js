import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupSeriesEdit from './PickupSeriesEdit'
import i18n from '@/i18n'
import { pickupSeriesMock } from '>/mockdata'
import { statusMocks } from '>/helpers'

storiesOf('PickupSeriesEdit', module)
  .add('Default', () => ({
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
    i18n,
  }))
