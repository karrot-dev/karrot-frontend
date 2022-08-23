import { get } from './mockAxios'

import { db } from './index'

export function createMockPlacesBackend () {
  get('/api/places/', () => [200, db.places])
}
