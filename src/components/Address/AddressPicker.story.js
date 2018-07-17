import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import AddressPicker from './AddressPicker'

storiesOf('AddressPicker', module)
  .add('Default', () => defaults({
    components: { AddressPicker },
    template: '<AddressPicker v-model="item" />',
    data () {
      return {
        item: {
          address: '',
          latitude: '',
          longitude: '',
        },
      }
    },
  }))
