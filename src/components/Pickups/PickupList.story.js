import { storiesOf } from '@storybook/vue'

import PickupList from './PickupList.vue'
import { pickupsMock } from '../mockdata.js'

storiesOf('PickupList', module)
  .add('Default', () => ({
    components: { PickupList },
    template: '<div id="q-app"><PickupList :pickups="pickups"></PickupList></div>',
    data () {
      return {
        pickups: pickupsMock
      }
    }
  }))
