import { storiesOf } from '@storybook/vue'

import MainLayout from './MainLayout.vue'
import KTopbarUI from './KTopbarUI.vue'
import KFooter from './KFooter.vue'
import Wall from '../Wall/Wall.vue'
import SidenavMap from '../Sidenav/SidenavMap.vue'
import SidenavGroup from '../Sidenav/SidenavGroup.vue'
import SidenavStores from '../Sidenav/SidenavStores.vue'
import { storesMock, usersMock } from '../mockdata.js'
import i18n from '@/i18n'

const mainLayoutTemplate = `
<div id="q-app">
  <MainLayout>
    <template slot="sidenav">      
      <SidenavMap :stores="stores" :users="users"/>
      <SidenavGroup/>
      <SidenavStores :stores="stores"/>
    </template>
    <div>
      <Wall/>
    </div>
  </MainLayout>
</div>'`

storiesOf('Layout', module)
  .add('MainLayout with Sidenav', () => ({
    components: { MainLayout, SidenavMap, SidenavGroup, SidenavStores, Wall },
    template: mainLayoutTemplate,
    data () {
      return {
        stores: storesMock,
        users: usersMock,
      }
    },
    i18n,
  }))
  .add('KTopbar', () => ({
    components: { KTopbarUI },
    template: '<div id="q-app"><KTopbarUI/></div>',
  }))
  .add('KFooter', () => ({
    components: { KFooter },
    template: '<div id="q-app"><KFooter/></div>',
  }))
