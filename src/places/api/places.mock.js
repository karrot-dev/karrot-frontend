import { createBackend } from '>/mockAxios'

export function createPlace (params = {}) {
  throw new Error('implement createPlace!')
}

export function createMockPlacesBackend (entries, options = {}) {
  createBackend('/api/places/', entries)
}
