import { storiesOf } from '@storybook/vue'

import KBox from './KBox.vue'

storiesOf('General Components', module)
  .add('KBox', () => ({
    components: { KBox },
    template: '<div id="q-app"><KBox></KBox></div>'
  }))
