import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import GroupMap from './GroupMap'
import UserMapPreview from './UserMapPreview'
import StandardMap from './StandardMap'
import { usersMock, storesMock, storeWithoutLocation } from '>/mockdata'
import L from 'leaflet'

const style = {
  height: '200px',
}

function latLng (store) {
  return L.latLng(store.latitude, store.longitude)
}

const currentGroup = {
  id: 1,
  latitude: 52.5198535,
  longitude: 13.4385964,
  membership: {
    isEditor: true,
  },
}

storiesOf('Map', module)
  .add('StandardMap', () => defaults({
    render: h => h(StandardMap, {
      props: {
        markers: [
          {
            latLng: latLng(storesMock[0]),
            fontIcon: 'fas fa-shopping-cart',
            color: 'blue',
          },
        ],
      },
      style: { height: '600px' },
    }),
  }))
  .add('StandardMap (selected marker)', () => defaults({
    render: h => h(StandardMap, {
      props: {
        markers: [
          {
            latLng: latLng(storesMock[1]),
            id: 'marker1',
            fontIcon: 'fas fa-shopping-cart',
            color: 'blue',
          },
          {
            latLng: latLng(storesMock[3]),
            id: 'marker2',
            fontIcon: 'fas fa-shopping-cart',
            color: 'blue',
          },
        ],
        selectedMarkers: [
          {
            latLng: latLng(storesMock[1]),
            id: 'marker1',
            fontIcon: 'fas fa-shopping-cart',
            color: 'blue',
          },
        ],
      },
      style: { height: '600px' },
    }),
  }))
  .add('GroupMap', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
        currentGroup,
      },
      style,
    }),
  }))
  .add('GroupMap (selected store)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
        selectedStore: storesMock[1],
        currentGroup,
      },
      style,
    }),
  }))
  .add('GroupMap (store has no location)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        stores: [...storesMock, storeWithoutLocation],
        showStores: true,
        showUsers: true,
        selectedStore: storeWithoutLocation,
        currentGroup,
      },
      style,
    }),
  }))
  .add('GroupMap (group has no location)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: [],
        stores: [],
        showStores: true,
        showUsers: true,
        currentGroup: {
          ...currentGroup,
          latitude: null,
          longitude: null,
        },
      },
      style,
    }),
  }))
  .add('GroupMap (only group location)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: [],
        stores: [],
        showStores: true,
        showUsers: true,
        currentGroup,
      },
      style,
    }),
  }))
  .add('UserMapPreview', () => defaults({
    render: h => h(UserMapPreview, {
      props: {
        user: usersMock[0],
      },
      style: { height: '600px' },
    }),
  }))
