import { storiesOf } from '@storybook/vue'

import PickupList from './PickupList.vue'
import { pickupsMock } from '../mockdata.js'
import i18n from '@/i18n'

storiesOf('PickupList', module)
  .add('Default', () => ({
    components: { PickupList },
    template: '<div id="q-app"><PickupList :pickups="pickups"></PickupList></div>',
    data () {
      return {
        pickups: pickupsMock,
      }
    },
    i18n,
  }))
