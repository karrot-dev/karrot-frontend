import GroupMarker from './GroupMarker'
import UserMarker from './UserMarker'
import PlaceMarker from './PlaceMarker'

export function groupMarker (group) {
  return {
    latLng: { lat: group.latitude, lng: group.longitude },
    id: 'group_' + group.id,
    fontIcon: group.isMember ? 'fas fa-home' : 'fas fa-info-circle',
    color: group.isMember ? 'positive' : 'blue',
    popup: {
      render: h => h(GroupMarker, { props: { group } }),
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
      render: h => h(UserMarker, { props: { user } }),
    },
  }
}

export function placeMarker (place) {
  return {
    latLng: { lat: place.latitude, lng: place.longitude },
    id: 'place_' + place.id,
    fontIcon: 'fas fa-shopping-cart',
    color: place.ui.color,
    popup: {
      render: h => h(PlaceMarker, { props: { place } }),
    },
  }
}
