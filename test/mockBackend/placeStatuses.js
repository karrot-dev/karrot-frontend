import { faker } from '@faker-js/faker'

import en from '@/locales/locale-en.json'

import { db } from '>/mockBackend/index'
import { get, post, patch } from '>/mockBackend/mockAxios'
import { realSample } from '>/mockBackend/utils'

export const translatablePlaceStatusNames = Object.keys(en.PLACE_STATUS_NAMES)

let nextId = 1
export function generatePlaceStatus (params = {}) {
  if (!params.group) throw new Error('must provide group')
  return {
    id: nextId++,
    name: realSample(translatablePlaceStatusNames),
    colour: 'red',
    group: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    // TODO: maybe add isArchived/archivedAt?
    ...params,
  }
}

function toResponse (placeStatus) {
  return {
    ...placeStatus,
    nameIsTranslatable: translatablePlaceStatusNames.includes(placeStatus.name),
  }
}

export function createMockPlaceStatusesBackend () {
  get(
    '/api/place-statuses/',
    () => [200, db.placeStatuses.map(toResponse)],
  )

  post(
    '/api/place-statuses/',
    ({ data }) => {
      if (!data.name) return [400, { name: 'name should not be empty!' }]
      const placeStatus = generatePlaceStatus({ ...data })
      db.placeStatuses.push(placeStatus)
      return [201, toResponse(placeStatus)]
    },
  )

  patch(
    '/api/place-statuses/:id/',
    ({ pathParams, data }) => {
      const placeStatus = db.placeStatuses.find(({ id }) => id === parseInt(pathParams.id))
      if (!placeStatus) return [404, {}]
      Object.assign(placeStatus, data)
      return [200, toResponse(placeStatus)]
    },
  )
}
