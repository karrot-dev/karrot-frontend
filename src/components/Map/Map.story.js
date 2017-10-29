import { storiesOf } from '@storybook/vue'

import MapDemo from './MapDemo'
import GroupMap from './GroupMap'
import UserMapPreview from './UserMapPreview'
import StandardMap from './StandardMap'
import { usersMock, storesMock } from '>/mockdata'
import L from 'leaflet'
import router from '@/router'
import i18n from '@/i18n'

const style = {
  height: '200px',
}

const activeGroup = { latitude: 52.5198535, longitude: 13.4385964 }

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
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
        activeGroup,
      },
      style,
    }),
    router,
    i18n,
  }))
  .add('GroupMap (selected store)', () => ({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
        selectedStoreId: storesMock[0].id,
        activeGroup,
      },
      style,
    }),
    router,
    i18n,
  }))
  .add('GroupMap (store has no location)', () => ({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        stores: storesMock,
        showStores: true,
        showUsers: true,
        selectedStoreId: 999,
        activeGroup,
      },
      style,
    }),
    router,
    i18n,
  }))
  .add('GroupMap (group has no location)', () => ({
    render: h => h(GroupMap, {
      props: {
        users: [],
        stores: [],
        showStores: true,
        showUsers: true,
        activeGroup: {},
      },
      style,
    }),
    router,
    i18n,
  }))
  .add('GroupMap (only group location)', () => ({
    render: h => h(GroupMap, {
      props: {
        users: [],
        stores: [],
        showStores: true,
        showUsers: true,
        activeGroup,
      },
      style,
    }),
    router,
    i18n,
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
