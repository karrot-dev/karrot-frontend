import { storiesOf } from '@storybook/vue'

import AddressPicker from './AddressPicker.vue'

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
  }))
