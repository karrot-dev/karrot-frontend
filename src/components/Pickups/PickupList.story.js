import { storiesOf } from '@storybook/vue'

import PickupList from './PickupList.vue'

storiesOf('PickupList', module)
  .add('Default', () => ({
    components: { PickupList },
    template: '<div id="q-app"><PickupList :pickups="pickups"></PickupList></div>',
    data () {
      return {
        pickups: [
          { 'id': 873, 'date': '2017-08-12T08:00:00Z', 'series': 36, 'store': 18, 'max_collectors': 4, 'collector_ids': [1, 2, 3, 4], 'description': 'This Pickup is very Fun!', isFull: true, isUserMember: false },
          { 'id': 874, 'date': '2017-08-13T08:00:00Z', 'series': 16, 'store': 13, 'max_collectors': 2, 'collector_ids': [], 'description': '', isFull: false, isUserMember: true }
        ]
      }
    }
  }))
