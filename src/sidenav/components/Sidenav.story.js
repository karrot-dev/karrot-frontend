import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

import GroupOptions from './GroupOptionsUI'
import MobileSidenavUI from './MobileSidenavUI'
import SidenavGroupUI from './SidenavGroupUI'
import SidenavMapUI from './SidenavMapUI'
import SidenavPlacesUI from './SidenavPlacesUI'

const range = n => [...Array(n).keys()]

const user = factories.makeUser()
const group = factories.makeGroup()
const users = range(5).map(() => factories.makeUser())
const places = range(5).map(() => factories.makePlace({
  group,
}))

storiesOf('Sidenav', module)
  .add('Map', () => defaults({
    render () {
      const { showPlaces, showUsers, onToggleUsers, onTogglePlaces } = this
      return h(SidenavMapUI, {
        places,
        users,
        showPlaces,
        showUsers,
        currentGroup: {
          ...group,
          membership: {
            isEditor: true,
          },
        },
        onTogglePlaces,
        onToggleUsers,
      })
    },
    data () {
      return {
        showPlaces: true,
        showUsers: true,
      }
    },
    methods: {
      onTogglePlaces () {
        this.showPlaces = !this.showPlaces
      },
      onToggleUsers () {
        this.showUsers = !this.showUsers
      },
    },
  }))

  .add('Group', () => defaults({
    render: () => h(SidenavGroupUI, {
      groupId: 1,
      wallUnreadCount: 4,
      pendingApplications: Array(3),
    }),
    store: createDatastore({
      currentGroup: { getters: { id: () => 1, roles: () => ['editor'] } },
      places: { getters: { all: () => places } },
    }),
  }))

  .add('GroupOptions', () => defaults({
    render: () => h(GroupOptions, {
      currentGroupId: 1,
      roles: ['editor'],
    }),
  }))

  .add('Places', () => defaults({
    render: () => h(SidenavPlacesUI, {
      places,
      groupId: 1,
    }),
  }))

  .add('Mobile', () => defaults({
    render: () => h(MobileSidenavUI, {
      currentUserId: user.id,
    }),
  }))
