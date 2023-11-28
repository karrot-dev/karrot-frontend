import { markRaw, unref } from 'vue'

import { usePlaceStatus, usePlaceStatusColourName, usePlaceType } from '@/places/helpers'

import GroupMarker from './GroupMarker.vue'
import PlaceMarker from './PlaceMarker.vue'
import UserMarker from './UserMarker.vue'

export function groupMarker (group) {
  return {
    latLng: { lat: group.latitude, lng: group.longitude },
    id: 'group_' + group.id,
    fontIcon: group.isMember ? 'fas fa-home' : 'fas fa-info-circle',
    color: group.isMember ? 'positive' : 'blue',
    popup: {
      component: markRaw(GroupMarker), // markers are part of reactive data, but don't want the component itself to become reactive (otherwise some error happens)
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
  const placeType = usePlaceType(place.placeType)
  const placeStatus = usePlaceStatus(place.status)
  const colourName = usePlaceStatusColourName(placeStatus)

  console.log('place marker for place', place.name, { placeType: unref(placeType), placeStatus: unref(placeStatus), colourName: unref(colourName), icon: unref(placeType)?.icon })

  return {
    latLng: { lat: place.latitude, lng: place.longitude },
    id: 'place_' + place.id,
    fontIcon: unref(placeType)?.icon || 'fas fa-map-marker',
    color: unref(colourName),
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
