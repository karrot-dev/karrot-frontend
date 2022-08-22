import { createBackend } from '>/mockAxios'

export function createPlace (params = {}) {
  throw new Error('implement createPlace!')
}

export function createMockPlacesBackend (db) {
  createBackend('/api/places/', () => db.places)
}
