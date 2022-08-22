import { createBackend } from './mockAxios'

import { db } from './index'

export function createMockPlacesBackend () {
  createBackend('/api/places/', () => db.places)
}
