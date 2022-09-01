import { db } from '>/mockBackend/index'

let nextId = 1
export function generateActivitySeries (params = {}) {
  if (!params.place) throw new Error('must provide place')
  if (!params.activityType) {
    // Auto-choose one based on place -> group
    const place = db.orm.places.get({ id: params.place })
    params.activityType = db.orm.activityTypes.get({ group: place.group }).id
  }
  return {
    id: nextId++,
    activityType: null,
    maxParticipants: 2,
    place: null,
    rule: {
      byDay: ['TU'],
      custom: 'FREQ=WEEKLY;BYDAY=TU',
      freq: 'WEEKLY',
      isCustom: false,
    },
    startDate: new Date(),
    description: '',
    datesPreview: [],
    ...params,
  }
}
