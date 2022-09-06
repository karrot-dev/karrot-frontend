import { convert } from '@/activities/api/activitySeries'

import { db } from '>/mockBackend/index'
import { get, post } from '>/mockBackend/mockAxios'

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

function toResponse (activitySeries) {
  return {
    ...activitySeries,
    rule: activitySeries.rule.custom,
  }
}

export function createMockActivitySeriesBackend () {
  get(
    '/api/activity-series/',
    () => [200, db.activitySeries.map(toResponse)], // TODO add filters
  )

  post(
    '/api/activity-series/',
    ({ data }) => {
      const series = generateActivitySeries({ ...convert(data) })
      db.activitySeries.push(series)
      return [201, toResponse(series)]
    },
  )
}
