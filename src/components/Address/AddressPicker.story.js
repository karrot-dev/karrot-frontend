import { storiesOf } from '@storybook/vue'

import AddressPicker from './AddressPicker.vue'

storiesOf('AddressPicker', module)
  .add('Default', () => ({
    components: { AddressPicker },
    template: '<AddressPicker />'
  }))
