import { faker } from '@faker-js/faker'

import en from '@/locales/locale-en.json'

import { db } from '>/mockBackend/index'
import { get, post, patch } from '>/mockBackend/mockAxios'
import { realSample, toAPIResponse } from '>/mockBackend/utils'

export const translatablePlaceStatusNames = Object.keys(en.PLACE_STATUS_NAMES)

let nextId = 1
export function generatePlaceStatus (params = {}) {
  if (!params.group) throw new Error('must provide group')
  return {
    id: nextId++,
    name: realSample(translatablePlaceStatusNames),
    colour: 'red',
    group: null,
    isVisible: true,
    archivedAt: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...params,
  }
}

function toPlaceStatusResponse (placeStatus) {
  return toAPIResponse({
    ...placeStatus,
    isArchived: Boolean(placeStatus.archivedAt),
    nameIsTranslatable: translatablePlaceStatusNames.includes(placeStatus.name),
  })
}

export function createMockPlaceStatusesBackend () {
  get(
    '/api/place-statuses/',
    () => [200, db.placeStatuses.map(toPlaceStatusResponse)],
  )

  post(
    '/api/place-statuses/',
    ({ data }) => {
      if (!data.name) return [400, { name: 'name should not be empty!' }]
      const placeStatus = generatePlaceStatus({ ...data })
      db.placeStatuses.push(placeStatus)
      return [201, toPlaceStatusResponse(placeStatus)]
    },
  )

  patch(
    '/api/place-statuses/:id/',
    ({ pathParams, data }) => {
      const placeStatus = db.placeStatuses.find(({ id }) => id === parseInt(pathParams.id))
      if (!placeStatus) return [404, {}]
      Object.assign(placeStatus, data)
      return [200, toPlaceStatusResponse(placeStatus)]
    },
  )
}
