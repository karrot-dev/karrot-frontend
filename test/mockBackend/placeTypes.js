import { faker } from '@faker-js/faker'

import en from '@/locales/locale-en.json'

import { db } from '>/mockBackend/index'
import { get, post, patch } from '>/mockBackend/mockAxios'
import { sample } from '>/mockBackend/offers'

export const translatablePlaceTypeNames = Object.keys(en.PLACE_TYPE_NAMES)

let nextId = 1
export function generatePlaceType (params = {}) {
  if (!params.group) throw new Error('must provide group')
  return {
    id: nextId++,
    name: sample(translatablePlaceTypeNames),
    icon: 'fas fa-circle',
    status: 'active',
    group: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...params,
  }
}

function toResponse (placeType) {
  return {
    ...placeType,
    nameIsTranslatable: translatablePlaceTypeNames.includes(placeType.name),
  }
}

export function createMockPlaceTypesBackend () {
  get(
    '/api/place-types/',
    () => [200, db.placeTypes.map(toResponse)],
  )

  post(
    '/api/place-types/',
    ({ data }) => {
      if (!data.name) return [400, { name: 'name should not be empty!' }]
      const placeType = generatePlaceType({ ...data })
      db.placeTypes.push(placeType)
      return [201, toResponse(placeType)]
    },
  )

  patch(
    '/api/place-types/:id/',
    ({ pathParams, data }) => {
      const placeType = db.placeTypes.find(({ id }) => id === parseInt(pathParams.id))
      if (!placeType) return [404, {}]
      Object.assign(placeType, data)
      return [200, toResponse(placeType)]
    },
  )
}
