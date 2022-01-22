import { storiesOf } from '@storybook/vue'

import SideNavMapUI from './SideNavMapUI'
import SideNavGroupUI from './SideNavGroupUI'
import GroupOptions from './GroupOptionsUI'
import SideNavPlacesUI from './SideNavPlacesUI'
import MobileSideNavUI from './MobileSideNavUI'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const user = factories.makeUser()
const group = factories.makeGroup()
const users = range(5).map(() => factories.makeUser())
const places = range(5).map(() => factories.makePlace({
  group,
}))

storiesOf('SideNav', module)
  .add('Map', () => defaults({
    render (h) {
      const { showPlaces, showUsers, toggleUsers, togglePlaces } = this
      return h(SideNavMapUI, {
        props: {
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
    render: h => h(SideNavGroupUI, {
      props: {
        groupId: 1,
        wallUnreadCount: 4,
        pendingApplications: Array(3),
      },
    }),
    store: createDatastore({
      currentGroup: { getters: { id: () => 1, roles: () => ['editor'] } },
      places: { getters: { all: () => places } },
    }),
  }))

  .add('GroupOptions', () => defaults({
    render: h => h(GroupOptions, {
      props: {
        currentGroupId: 1,
        roles: ['editor'],
      },
    }),
  }))

  .add('Places', () => defaults({
    render: h => h(SideNavPlacesUI, {
      props: {
        places,
        groupId: 1,
      },
    }),
  }))

  .add('Mobile', () => defaults({
    render: h => h(MobileSideNavUI, {
      props: {
        currentUserId: user.id,
      },
    }),
  }))
