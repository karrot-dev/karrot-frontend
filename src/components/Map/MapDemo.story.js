import { storiesOf } from '@storybook/vue'

import MapDemo from './MapDemo.vue'

storiesOf('GroupMap', module)
  .add('Default', () => ({
    components: { MapDemo },
    template: '<MapDemo style="height: 600px" />'
  }))
