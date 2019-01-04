import { escape } from '@/utils/utils'
import router from '@/base/router'

// TODO: popupcontent should also accept an HTML element
// https://leafletjs.com/reference-1.3.4.html#popup-setcontent
// So we could use vue components inside popups

function groupUrl (groupId) {
  return router.resolve({ name: 'group', params: { groupId } }).href
}

export function groupMarker (group) {
  return {
    latLng: { lat: group.latitude, lng: group.longitude },
    id: 'group_' + group.id,
    fontIcon: group.isMember ? 'fas fa-home' : 'fas fa-info-circle',
    color: group.isMember ? 'positive' : 'blue',
    popupcontent: `<big><a href="${groupUrl(group.id)}">${escape(group.name)}</a></big>`,
  }
}

function userUrl (userId) {
  return router.resolve({ name: 'user', params: { userId } }).href
}

export function userMarker (user) {
  return {
    latLng: { lat: user.latitude, lng: user.longitude },
    id: 'user_' + user.id,
    fontIcon: 'fas fa-user',
    color: 'positive',
    popupcontent: `<a href="${userUrl(user.id)}">${escape(user.displayName)}</a>`,
  }
}

function placeUrl (groupId, placeId) {
  return router.resolve({ name: 'place', params: { groupId, placeId } }).href
}

export function placeMarker (place) {
  return {
    latLng: { lat: place.latitude, lng: place.longitude },
    id: 'place_' + place.id,
    fontIcon: 'fas fa-shopping-cart',
    color: place.ui.color,
    popupcontent: `<a href="${placeUrl(place.group.id, place.id)}">${escape(place.name)}</a>`,
  }
}
