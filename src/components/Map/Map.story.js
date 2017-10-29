import { storiesOf } from '@storybook/vue'

import MapDemo from './MapDemo'
import GroupMap from './GroupMap'
import UserMapPreview from './UserMapPreview'
import StandardMap from './StandardMap'
import { usersMock, storesMock } from '>/mockdata'
import L from 'leaflet'
import router from '@/router'

storiesOf('Map', module)
  .add('StandardMap', () => ({
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
  .add('StandardMap (selected marker)', () => ({
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
  .add('Demo', () => ({
    components: { MapDemo },
    template: '<MapDemo style="height: 600px" />',
  }))
  .add('GroupMap', () => ({
    components: { GroupMap },
    template: '<GroupMap :stores="stores" :users="users" :showUsers="showUsers" :showStores="showStores" style="height: 600px" />',
    data () {
      return {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
      }
    },
  }))
  .add('GroupMap (selected store)', () => ({
    components: { GroupMap },
    template: '<GroupMap :stores="stores" :users="users" :showUsers="showUsers" :showStores="showStores" :selectedStoreId="selectedStoreId" style="height: 600px" />',
    data () {
      return {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
        selectedStoreId: storesMock[0].id,
      }
    },
  }))
  .add('UserMapPreview', () => ({
    components: { UserMapPreview },
    template: '<UserMapPreview :user="user" style="height: 600px" />',
    router,
    data () {
      return {
        user: usersMock[0],
      }
    },
  }))
