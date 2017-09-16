import { storiesOf } from '@storybook/vue'

import KBox from './KBox.vue'
import KBreadcrumb from './KBreadcrumb.vue'

storiesOf('General Components', module)
  .add('KBox', () => ({
    components: { KBox },
    template: '<div id="q-app"><KBox></KBox></div>'
  }))

  .add('KBreadcrumb', () => ({
    components: { KBreadcrumb },
    template: '<div id="q-app"><KBreadcrumb :breadcrumbs="bread"></KBreadcrumb></div>',
    data () {
      return {
        bread: ['Group', 'Store', 'Pickups']
      }
    }
  }))
