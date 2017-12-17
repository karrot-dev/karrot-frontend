import { storiesOf } from '@storybook/vue'
import i18n from '@/i18n'

import AddressPicker from './AddressPicker'

storiesOf('AddressPicker', module)
  .add('Default', () => ({
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
    i18n,
  }))
  .add('With map', () => ({
    components: { AddressPicker },
    template: '<AddressPicker v-model="item" :map="true" />',
    data () {
      return {
        item: {
          address: '',
          latitude: '',
          longitude: '',
        },
      }
    },
    i18n,
  }))
