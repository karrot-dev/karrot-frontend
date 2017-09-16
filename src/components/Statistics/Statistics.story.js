import { storiesOf } from '@storybook/vue'

import AmountPicker from './AmountPicker.vue'
import AmountBox from './AmountBox.vue'

const amountPicker = `
<div id="q-app" style="padding: 2em">
  <AmountPicker/>
</div>
`

storiesOf('Statistics', module)
  .add('AmountPicker', () => ({
    components: { AmountPicker },
    template: amountPicker
  }))
  .add('AmountBox', () => ({
    components: { AmountBox },
    template: '<div id="q-app" style="padding: 2em"><AmountBox :amount="20"/></div>'
  }))
