import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import MapDemo from './MapDemo'
import GroupMap from './GroupMap'
import UserMapPreview from './UserMapPreview'
import StandardMap from './StandardMap'
import { usersMock, storesMock } from '>/mockdata'
import L from 'leaflet'

const style = {
  height: '200px',
}

const currentGroup = { latitude: 52.5198535, longitude: 13.4385964 }

storiesOf('Map', module)
  .add('StandardMap', () => defaults({
    components: { StandardMap },
    template: '<StandardMap :markers="markers" style="height: 600px" />',
    data () {
      const store = storesMock[0]
      return {
        markers: [
          {
            latLng: L.latLng(store.latitude, store.longitude),
            icon: L.AwesomeMarkers.icon({
              icon: 'shopping-cart',
              markerColor: 'blue',
              prefix: 'fa',
            }),
          },
        ],
      }
    },
  }))
  .add('StandardMap (selected marker)', () => defaults({
    components: { StandardMap },
    template: '<StandardMap :markers="markers" :selectedMarkerIds="selectedMarkerIds" style="height: 600px" />',
    data () {
      const store1 = storesMock[1]
      const store2 = storesMock[3]
      return {
        selectedMarkerIds: ['marker1'],
        markers: [
          {
            latLng: L.latLng(store1.latitude, store1.longitude),
            id: 'marker1',
            icon: L.AwesomeMarkers.icon({
              icon: 'shopping-cart',
              markerColor: 'blue',
              prefix: 'fa',
            }),
          },
          {
            latLng: L.latLng(store2.latitude, store2.longitude),
            id: 'marker2',
            icon: L.AwesomeMarkers.icon({
              icon: 'shopping-cart',
              markerColor: 'blue',
              prefix: 'fa',
            }),
          },
        ],
      }
    },
  }))
  .add('Demo', () => defaults({
    components: { MapDemo },
    template: '<MapDemo style="height: 600px" />',
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
    components: { UserMapPreview },
    template: '<UserMapPreview :user="user" style="height: 600px" />',
    data () {
      return {
        user: usersMock[0],
      }
    },
  }))
