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

function storeUrl (groupId, storeId) {
  return router.resolve({ name: 'store', params: { groupId, storeId } }).href
}

export function storeMarker (store) {
  return {
    latLng: { lat: store.latitude, lng: store.longitude },
    id: 'store_' + store.id,
    fontIcon: 'fas fa-shopping-cart',
    color: store.ui.color,
    popupcontent: `<a href="${storeUrl(store.group.id, store.id)}">${escape(store.name)}</a>`,
  }
}
