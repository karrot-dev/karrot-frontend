import { storiesOf } from '@storybook/vue'

import PickupList from './PickupList.vue'
import { pickupsMock } from '>/mockdata'
import i18n from '@/i18n'

storiesOf('PickupList', module)
  .add('Default', () => ({
    components: { PickupList },
    template: '<PickupList :pickups="pickups"></PickupList>',
    data () {
      return {
        pickups: pickupsMock,
      }
    },
    i18n,
  }))
