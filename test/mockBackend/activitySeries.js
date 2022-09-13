import { convert, serialize } from '@/activities/api/activitySeries'

import { db } from '>/mockBackend/index'
import { get, post, patch } from '>/mockBackend/mockAxios'

let nextId = 1
let nextParticipantTypeId = 1
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
    participantTypes: [{ id: nextParticipantTypeId++, role: 'member', maxParticipants: 2 }],
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
  return serialize(activitySeries)
}

export function createMockActivitySeriesBackend () {
  get(
    '/api/activity-series/',
    () => [200, db.activitySeries.map(toResponse)], // TODO add filters
  )

  patch(
    '/api/activity-series/:id/check/',
    ({ pathParams, data }) => {
      // TODO implement properly
      return [200, {
        participants: [],
        activities: [],
      }]
    },
  )

  post(
    '/api/activity-series/',
    ({ data }) => {
      const series = generateActivitySeries({ ...convert(data) })
      db.activitySeries.push(series)
      return [201, toResponse(series)]
    },
  )

  patch(
    '/api/activity-series/:id/',
    ({ pathParams, data }) => {
      const series = db.activitySeries.find(({ id }) => id === parseInt(pathParams.id))
      if (!series) return [404, {}]
      Object.assign(series, convert({
        ...serialize(series),
        ...data,
      }))
      return [200, toResponse(series)]
    },
  )
}
