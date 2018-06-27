export function groupMarker (group) {
  return {
    latLng: { lat: group.latitude, lng: group.longitude },
    id: 'group_' + group.id,
    fontIcon: group.isMember ? 'fas fa-home' : 'fas fa-info-circle',
    color: group.isMember ? 'positive' : 'blue',
    popupcontent: `<big><a href="/#/group/${group.id}/">${group.name}</a></big>`,
  }
}

export function userMarker (user) {
  return {
    latLng: { lat: user.latitude, lng: user.longitude },
    id: 'user_' + user.id,
    fontIcon: 'fas fa-user',
    color: 'positive',
    popupcontent: `<a href="/#/user/${user.id}">${user.displayName}</a>`,
  }
}

export function storeMarker (store) {
  return {
    latLng: { lat: store.latitude, lng: store.longitude },
    id: 'store_' + store.id,
    fontIcon: 'fas fa-shopping-cart',
    color: store.ui.color,
    popupcontent: `<a href="/#/group/${store.group.id}/store/${store.id}">${store.name}</a>`,
  }
}
