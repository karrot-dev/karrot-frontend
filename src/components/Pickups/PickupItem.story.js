import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupItem from './PickupItem.vue'
import i18n from '@/i18n'

const methods = {
  join: action('join'),
  leave: action('leave'),
}

storiesOf('PickupItem', module)
  .add('Join', () => ({
    components: { PickupItem },
    template: '<PickupItem @join="join" :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: 'This is the description',
          isFull: false,
          isUserMember: false,
        },
      }
    },
    methods,
    i18n,
  }))
  .add('Waiting', () => ({
    components: { PickupItem },
    template: '<PickupItem @join="join" :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: 'This is the description',
          isFull: false,
          isUserMember: false,
          isWaiting: true,
        },
      }
    },
    methods,
    i18n,
  }))
  .add('Full', () => ({
    components: { PickupItem },
    template: '<PickupItem :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: '',
          isFull: true,
          isUserMember: false,
        },
      }
    },
    i18n,
  }))
  .add('Leave', () => ({
    components: { PickupItem },
    template: '<PickupItem @leave="leave" :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: '',
          isFull: false,
          isUserMember: true,
        },
      }
    },
    methods,
    i18n,
  }))
