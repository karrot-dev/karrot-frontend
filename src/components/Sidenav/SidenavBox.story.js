import { storiesOf } from '@storybook/vue'

import SidenavBox from './SidenavBox'
import SidenavMapUI from './SidenavMapUI'
import SidenavGroup from './SidenavGroup'
import SidenavStoresUI from './SidenavStoresUI'
import { storesMock as stores, usersMock as users, groupsMock } from '>/mockdata'
import i18n from '@/i18n'
import router from '@/router'
import { createStore } from '>/helpers'

const store = createStore({
  groups: {
    getters: {
      currentGroupId: () => 1,
    },
  },
  stores: {
    getters: {
      all: () => stores,
    },
  },
})

storiesOf('Sidenav Boxes', module)
  .add('Default', () => SidenavBox)

  .add('Map', () => ({
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
    i18n,
    store,
  }))

  .add('Group', () => ({
    render: h => h(SidenavGroup),
    i18n,
    router,
    store,
  }))

  .add('Stores', () => ({
    render: h => h(SidenavStoresUI, { props: { stores } }),
    i18n,
    router,
    store,
  }))
