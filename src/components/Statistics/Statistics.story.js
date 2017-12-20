import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import AmountPicker from './AmountPicker'
import AmountBox from './AmountBox'
import PickupFeedback from './PickupFeedback'

const amountPicker = `
<div style="padding: 2em">
  <AmountPicker/>
</div>
`

storiesOf('Statistics', module)
  .add('AmountPicker', () => defaults({
    components: { AmountPicker },
    template: amountPicker,
  }))
  .add('AmountBox', () => defaults({
    components: { AmountBox },
    template: '<div style="padding: 2em"><AmountBox :amount="20"/></div>',
  }))
  .add('PickupFeedback', () => defaults({
    components: { PickupFeedback },
    template: '<div style="padding: 2em"><PickupFeedback/></div>',
  }))
