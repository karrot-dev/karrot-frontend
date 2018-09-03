import { storiesOf } from '@storybook/vue'

import SidenavMapUI from './SidenavMapUI'
import SidenavGroupUI from './SidenavGroupUI'
import SidenavStoresUI from './SidenavStoresUI'
import { storesMock as stores, usersMock as users, groupsMock } from '>/mockdata'
import { createStore, storybookDefaults as defaults } from '>/helpers'

storiesOf('Sidenav Boxes', module)
  .add('Map', () => defaults({
    render (h) {
      let { showStores, showUsers, toggleUsers, toggleStores } = this
      return h(SidenavMapUI, {
        props: {
          stores,
          users,
          showStores,
          showUsers,
          currentGroup: {
            ...groupsMock[0],
            membership: {
              isEditor: true,
            },
          },
        },
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
  }))

  .add('Group', () => defaults({
    render: h => h(SidenavGroupUI, {
      props: {
        groupId: 1,
      },
    }),
    store: createStore({
      currentGroup: { getters: { id: () => 1, roles: () => [] } },
      stores: { getters: { all: () => stores } },
    }),
  }))

  .add('Stores', () => defaults({
    render: h => h(SidenavStoresUI, {
      props: {
        stores,
        groupId: 1,
      },
    }),
  }))
