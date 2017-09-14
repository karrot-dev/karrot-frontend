import { storiesOf } from '@storybook/vue'

import MainLayout from './MainLayout.vue'
import Topbar from './Topbar.vue'
import Footer from './Footer.vue'
import SidenavMap from '../Sidenav/SidenavMap.vue'
import SidenavGroup from '../Sidenav/SidenavGroup.vue'
import SidenavStores from '../Sidenav/SidenavStores.vue'

const mainLayoutTemplate = `
<div id="q-app">
  <MainLayout>
    <template slot="sidenav">      
      <SidenavMap/>
      <SidenavGroup/>
      <SidenavStores/>
    </template>
    <div>
      Content
    </div>
  </MainLayout>
</div>'`

storiesOf('Layout', module)
  .add('MainLayout with Sidenav', () => ({
    components: { MainLayout, SidenavMap, SidenavGroup, SidenavStores },
    template: mainLayoutTemplate
  }))
  .add('Topbar', () => ({
    components: { Topbar },
    template: '<div id="q-app"><Topbar/></div>'
  }))
  .add('Footer', () => ({
    components: { Footer },
    template: '<div id="q-app"><Footer/></div>'
  }))
