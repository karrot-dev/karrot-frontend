import { storiesOf } from '@storybook/vue'

import MapDemo from './MapDemo.vue'
import GroupMap from './GroupMap.vue'
import UserMapPreview from './UserMapPreview.vue'
import { usersMock, storesMock } from '../mockdata.js'

storiesOf('Map', module)
  .add('Demo', () => ({
    components: { MapDemo },
    template: '<MapDemo style="height: 600px" />',
  }))
  .add('GroupMap', () => ({
    components: { GroupMap },
    template: '<GroupMap :stores="stores" :users="users" :showUsers="showUsers" :showStores="showStores" style="height: 600px" />',
    data () {
      return {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
      }
    },
  }))
  .add('UserMapPreview', () => ({
    components: { UserMapPreview },
    template: '<UserMapPreview :user="user" style="height: 600px" />',
    data () {
      return {
        user: usersMock[0],
      }
    },
  }))
