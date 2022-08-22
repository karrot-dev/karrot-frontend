import { createBackend } from '>/mockAxios'

export function createUser (params = {}) {
  throw new Error('implement createUser!')
}

export function createMockUsersBackend (entries, options = {}) {
  createBackend('/api/users/', entries)
}
