import { get } from './mockAxios'

export function createMockConfigBackend () {
  // Just a stub so we don't have errors
  get('/api/config/', () => {
    return [200, {}]
  })
}
