import { storiesOf } from '@storybook/vue'

import SidenavBox from './SidenavBox.vue'
import SidenavMap from './SidenavMap.vue'
import SidenavGroup from './SidenavGroup.vue'
import SidenavStores from './SidenavStores.vue'
import { storesMock, usersMock } from '../mockdata.js'

storiesOf('Sidenav Boxes', module)
  .add('Default', () => ({
    components: { SidenavBox },
    template: '<div id="q-app"><SidenavBox></SidenavBox></div>'
  }))

  .add('Map', () => ({
    components: { SidenavMap },
    template: '<div id="q-app"><SidenavMap :stores="stores" :users="users"></SidenavMap></div>',
    data () {
      return {
        stores: storesMock,
        users: usersMock
      }
    }
  }))

  .add('Group', () => ({
    components: { SidenavGroup },
    template: '<div id="q-app"><SidenavGroup></SidenavGroup></div>'
  }))

  .add('Stores', () => ({
    components: { SidenavStores },
    template: '<div id="q-app"><SidenavStores :stores="stores"></SidenavStores></div>',
    data () {
      return {
        stores: storesMock
      }
    }
  }))
