<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

import SidenavMapUI from './SidenavMapUI'
import SidenavGroupUI from './SidenavGroupUI'
import GroupOptions from './GroupOptionsUI'
import SidenavPlacesUI from './SidenavPlacesUI'
import MobileSidenavUI from './MobileSidenavUI'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

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
