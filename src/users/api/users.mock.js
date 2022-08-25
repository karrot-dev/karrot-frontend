import { createBackend } from '>/mockAxios'

export function createUser (params = {}) {
  throw new Error('implement createUser!')
}

export function createMockUsersBackend (db) {
  createBackend('/api/users/', () => db.users)
}
