import { storiesOf } from '@storybook/vue'

import AmountPicker from './AmountPicker.vue'

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
