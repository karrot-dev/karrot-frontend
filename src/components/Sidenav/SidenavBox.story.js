import { storiesOf } from '@storybook/vue'

import SidenavMapUI from './SidenavMapUI'
import SidenavGroup from './SidenavGroup'
import SidenavStoresUI from './SidenavStoresUI'
import { storesMock as stores, usersMock as users, groupsMock } from '>/mockdata'
import { createStore, storybookDefaults as defaults } from '>/helpers'

const store = createStore({
  currentGroup: { getters: { id: () => 1, roles: () => [] } },
  stores: { getters: { all: () => stores } },
})

storiesOf('Sidenav Boxes', module)
  .add('Map', () => defaults({
    render (h) {
      let { showStores, showUsers, toggleUsers, toggleStores } = this
      return h(SidenavMapUI, {
        props: { stores, users, showStores, showUsers, currentGroup: groupsMock[0] },
        on: { toggleStores, toggleUsers },
      })
    },
    data () {
      return {
        showStores: true,
        showUsers: true,
      }
    },
    methods: {
      toggleStores () {
        this.showStores = !this.showStores
      },
      toggleUsers () {
        this.showUsers = !this.showUsers
      },
    },
    store,
  }))

  .add('Group', () => defaults({
    render: h => h(SidenavGroup),
    store,
  }))

  .add('Stores', () => defaults({
    render: h => h(SidenavStoresUI, { props: { stores } }),
    store,
  }))
