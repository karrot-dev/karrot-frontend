import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import GroupMap from './GroupMap'
import UserMapPreview from './UserMapPreview'
import StandardMap from './StandardMap'
import { usersMock, placesMock, placeWithoutLocation } from '>/mockdata'
import L from 'leaflet'

const style = {
  height: '200px',
}

function latLng (place) {
  return L.latLng(place.latitude, place.longitude)
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
            latLng: latLng(placesMock[0]),
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
            latLng: latLng(placesMock[1]),
            id: 'marker1',
            fontIcon: 'fas fa-shopping-cart',
            color: 'blue',
          },
          {
            latLng: latLng(placesMock[3]),
            id: 'marker2',
            fontIcon: 'fas fa-shopping-cart',
            color: 'blue',
          },
        ],
        selectedMarkers: [
          {
            latLng: latLng(placesMock[1]),
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
        places: placesMock,
        showPlaces: true,
        showUsers: true,
        currentGroup,
      },
      style,
    }),
  }))
  .add('GroupMap (selected place)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        places: placesMock,
        showPlaces: true,
        showUsers: true,
        selectedPlace: placesMock[1],
        currentGroup,
      },
      style,
    }),
  }))
  .add('GroupMap (place has no location)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: usersMock,
        places: [...placesMock, placeWithoutLocation],
        showPlaces: true,
        showUsers: true,
        selectedPlace: placeWithoutLocation,
        currentGroup,
      },
      style,
    }),
  }))
  .add('GroupMap (group has no location)', () => defaults({
    render: h => h(GroupMap, {
      props: {
        users: [],
        places: [],
        showPlaces: true,
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
        places: [],
        showPlaces: true,
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
