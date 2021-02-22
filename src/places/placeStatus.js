const statusOptions = {
  created: {
    label: 'STORESTATUS.CREATED',
    color: 'grey',
    icon: 'fas fa-map-marker-alt',
    selectable: true,
    sort: 3,
  },
  negotiating: {
    label: 'STORESTATUS.NEGOTIATING',
    color: 'blue',
    icon: 'fas fa-map-marker-alt',
    selectable: true,
    sort: 2,
  },
  active: {
    label: 'STORESTATUS.ACTIVE',
    color: 'positive',
    icon: 'fas fa-map-marker-alt',
    selectable: true,
    sort: 1,
  },
  declined: {
    label: 'STORESTATUS.DECLINED',
    color: 'negative',
    icon: 'fas fa-map-marker-alt',
    selectable: true,
    sort: 4,
  },
  archived: {
    label: 'STORESTATUS.ARCHIVED',
    color: 'grey',
    icon: 'fas fa-trash-alt',
    selectable: false,
    sort: 5,
  },
}

for (const key of Object.keys(statusOptions)) {
  statusOptions[key].key = key
}

export function optionsFor (place) {
  return statusOptions[place.status] || statusOptions.created
}

export const statusList = Object.values(statusOptions)
