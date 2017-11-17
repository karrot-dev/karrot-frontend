const statusOptions = {
  created: {
    label: 'STORESTATUS.CREATED',
    color: 'gray',
    icon: 'fa-circle-o',
    selectable: true,
    sort: 3,
  },
  negotiating: {
    label: 'STORESTATUS.NEGOTIATING',
    color: 'blue',
    icon: 'fa-circle',
    selectable: true,
    sort: 2,
  },
  active: {
    label: 'STORESTATUS.ACTIVE',
    color: 'green',
    icon: 'fa-circle',
    selectable: true,
    sort: 1,
  },
  declined: {
    label: 'STORESTATUS.DECLINED',
    color: 'red',
    icon: 'fa-circle',
    selectable: true,
    sort: 4,
  },
  archived: {
    label: 'STORESTATUS.ARCHIVED',
    color: 'grey',
    icon: 'fa-trash',
    selectable: false,
  },
}

for (let key of Object.keys(statusOptions)) {
  statusOptions[key].key = key
}

export function optionsFor (store) {
  return statusOptions[store.status] || statusOptions.created
}

export const statusList = Object.values(statusOptions)
