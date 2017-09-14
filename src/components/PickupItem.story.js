import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupItem from './PickupItem.vue'

storiesOf('PickupItem', module)
  .add('Join', () => ({
    components: { PickupItem },
    template: '<div id="q-app"><PickupItem @join="join" :pickup="pickup"></PickupItem></div>',
    data () {
      return {
        pickup: {
          date: '12:00',
          description: 'hello',
          isFull: false,
          isUserMember: false
        }
      }
    },
    methods: {
      join: action('join')
    }
  }))
  .add('Full', () => ({
    components: { PickupItem },
    template: '<div id="q-app"><PickupItem :pickup="pickup"></PickupItem></div>',
    data () {
      return {
        pickup: {
          date: '00:00',
          description: 'hello',
          isFull: true,
          isUserMember: false
        }
      }
    }
  }))
  .add('Leave', () => ({
    components: { PickupItem },
    template: '<div id="q-app"><PickupItem @leave="leave" :pickup="pickup"></PickupItem></div>',
    data () {
      return {
        pickup: {
          date: '05:30 PM',
          description: 'hello',
          isFull: false,
          isUserMember: true
        }
      }
    },
    methods: {
      leave: action('leave')
    }
  }))
