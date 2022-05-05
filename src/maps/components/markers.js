import GroupMarker from './GroupMarker'
import UserMarker from './UserMarker'
import PlaceMarker from './PlaceMarker'
import icons from '@/base/icons'
import { markRaw } from 'vue'

export function groupMarker (group) {
  return {
    latLng: { lat: group.latitude, lng: group.longitude },
    id: 'group_' + group.id,
    fontIcon: group.isMember ? 'fas fa-home' : 'fas fa-info-circle',
    color: group.isMember ? 'positive' : 'blue',
    popup: {
      component: markRaw(GroupMarker),  // markers are part of reactive data, but don't want the component itself to become reactive (otherwise some error happens)
      props: { group },
    },
    gpx: {
      name: group.name,
      type: 'groups',
    },
  }
}

export function userMarker (user) {
  return {
    latLng: { lat: user.latitude, lng: user.longitude },
    id: 'user_' + user.id,
    fontIcon: 'fas fa-user',
    color: 'positive',
    popup: {
      component: markRaw(UserMarker),
      props: { user },
    },
    gpx: {
      name: user.displayName,
      type: 'users',
    },
  }
}

export function placeMarker (place) {
  return {
    latLng: { lat: place.latitude, lng: place.longitude },
    id: 'place_' + place.id,
    fontIcon: icons.get('place'),
    color: place.ui.color,
    popup: {
      component: markRaw(PlaceMarker),
      props: { place },
    },
    gpx: {
      name: place.name,
      desc: place.description,
      type: 'places',
    },
  }
}
