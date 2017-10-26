import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupSeriesEdit from './PickupSeriesEdit.vue'
import i18n from '@/i18n'
import { pickupSeriesMock } from '>/mockdata'

storiesOf('PickupSeriesEdit', module)
  .add('Default', () => ({
    render (h) {
      return h(PickupSeriesEdit, {
        props: {
          series: pickupSeriesMock[0],
          isWaiting: false,
          requestError () {},
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
