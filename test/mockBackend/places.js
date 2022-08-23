import { createBackend } from './mockAxios'

import { db } from './index'

export function createMockPlacesBackend () {
  createBackend('get', '/api/places/', () => db.places)
}
