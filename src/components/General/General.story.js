import { storiesOf } from '@storybook/vue'

import KBox from './KBox.vue'
import KBreadcrumb from './KBreadcrumb.vue'

storiesOf('General Components', module)
  .add('KBox', () => ({
    components: { KBox },
    template: '<div id="q-app"><KBox></KBox></div>',
  }))

  .add('KBreadcrumb', () => ({
    render: h => h(KBreadcrumb, {
      props: {
        breadcrumbs: [{ name: 'Foodsharing Berlin' }, { name: 'SirPlus' }],
      },
    }),
  }))
