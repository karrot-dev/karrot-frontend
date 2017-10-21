import { storiesOf } from '@storybook/vue'

import KBox from './KBox.vue'
import KBreadcrumb from './KBreadcrumb.vue'
import SearchUI from './SearchUI.vue'
import { storesMock, groupsMock, usersMock } from '>/mockdata'
import i18n from '@/i18n'

storiesOf('General Components', module)
  .add('KBox', () => ({
    render: h => h(KBox),
    i18n,
  }))

  .add('KBreadcrumb', () => ({
    render: h => h(KBreadcrumb, {
      props: {
        breadcrumbs: [{ name: 'Foodsharing Berlin' }, { name: 'SirPlus' }],
      },
    }),
    i18n,
  }))

  .add('SearchUI', () => ({
    render: h => h(SearchUI, {
      props: {
        stores: storesMock,
        groups: groupsMock,
        users: usersMock,
      },
    }),
    i18n,
  }))
