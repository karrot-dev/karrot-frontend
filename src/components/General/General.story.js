import { storiesOf } from '@storybook/vue'

import KBox from './KBox.vue'
import KBreadcrumb from './KBreadcrumb.vue'
import SearchUI from './SearchUI.vue'
import { storesMock, groupsMock, usersMock } from '../mockdata.js'

storiesOf('General Components', module)
  .add('KBox', () => KBox)

  .add('KBreadcrumb', () => ({
    render: h => h(KBreadcrumb, {
      props: {
        breadcrumbs: [{ name: 'Foodsharing Berlin' }, { name: 'SirPlus' }],
      },
    }),
  }))

  .add('SearchUI', () => ({
    components: { SearchUI },
    template: '<div id="q-app"><SearchUI :stores="stores" :groups="groups" :users="users"></SearchUI></div>',
    data () {
      return {
        stores: storesMock,
        groups: groupsMock,
        users: usersMock,
      }
    },
  }))
