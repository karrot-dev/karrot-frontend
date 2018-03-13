import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import GroupMap from './GroupMap'
import UserMapPreview from './UserMapPreview'
import StandardMap from './StandardMap'
import { usersMock, storesMock } from '>/mockdata'
import L from 'leaflet'

const style = {
  height: '200px',
}

function latLng (store) {
  return L.latLng(store.latitude, store.longitude)
}

const currentGroup = { latitude: 52.5198535, longitude: 13.4385964 }

storiesOf('Map', module)
  .add('StandardMap', () => defaults({
    render: h => h(StandardMap, {
      props: {
        markers: [
          {
            latLng: latLng(storesMock[0]),
            icon: L.AwesomeMarkers.icon({
              icon: 'shopping-cart',
              markerColor: 'blue',
              prefix: 'fa',
            }),
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
            icon: L.AwesomeMarkers.icon({
              icon: 'shopping-cart',
              markerColor: 'blue',
              prefix: 'fa',
            }),
          },
          {
            latLng: latLng(storesMock[3]),
            id: 'marker2',
            icon: L.AwesomeMarkers.icon({
              icon: 'shopping-cart',
              markerColor: 'blue',
              prefix: 'fa',
            }),
          },
        ],
        selectedMarkerIds: ['marker1'],
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
        selectedStoreId: storesMock[0].id,
        currentGroup,
      },
      style,
    }),
  }))
  .add('GroupMap (store has no location)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
        selectedStoreId: 999,
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
        currentGroup: {},
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
