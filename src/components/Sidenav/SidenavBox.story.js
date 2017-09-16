import { storiesOf } from '@storybook/vue'

import SidenavBox from './SidenavBox.vue'
import SidenavMapUI from './SidenavMapUI.vue'
import SidenavGroup from './SidenavGroup.vue'
import SidenavStores from './SidenavStores.vue'
import { storesMock as stores, usersMock as users } from '../mockdata.js'
import i18n from '@/i18n'

storiesOf('Sidenav Boxes', module)
  .add('Default', () => SidenavBox)

  .add('Map', () => ({
    data () {
      return {
        showStores: true,
        showUsers: true
      }
    },
    methods: {
      toggleStores () {
        this.showStores = !this.showStores
      },
      toggleUsers () {
        this.showUsers = !this.showUsers
      }
    },
    render (h) {
      let { showStores, showUsers, toggleUsers, toggleStores } = this
      return h(SidenavMapUI, {
        props: { stores, users, showStores, showUsers },
        on: { toggleStores, toggleUsers }
      })
    },
    i18n
  }))

  .add('Group', () => ({
    render: h => h(SidenavGroup),
    i18n
  }))

  .add('Stores', () => ({
    render: h => h(SidenavStores, { props: { stores } }),
    i18n
  }))
