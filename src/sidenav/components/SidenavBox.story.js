import { storiesOf } from '@storybook/vue'

import SidenavMapUI from './SidenavMapUI'
import SidenavGroupUI from './SidenavGroupUI'
import SidenavPlacesUI from './SidenavPlacesUI'
import { placesMock as places, usersMock as users, groupsMock } from '>/mockdata'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

storiesOf('Sidenav Boxes', module)
  .add('Map', () => defaults({
    render (h) {
      let { showPlaces, showUsers, toggleUsers, togglePlaces } = this
      return h(SidenavMapUI, {
        props: {
          places,
          users,
          showPlaces,
          showUsers,
          currentGroup: {
            ...groupsMock[0],
            membership: {
              isEditor: true,
            },
          },
        },
        on: { togglePlaces, toggleUsers },
      })
    },
    data () {
      return {
        showPlaces: true,
        showUsers: true,
      }
    },
    methods: {
      togglePlaces () {
        this.showPlaces = !this.showPlaces
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
    store: createDatastore({
      currentGroup: { getters: { id: () => 1, roles: () => [] } },
      places: { getters: { all: () => places } },
    }),
  }))

  .add('Places', () => defaults({
    render: h => h(SidenavPlacesUI, {
      props: {
        places,
        groupId: 1,
      },
    }),
  }))
