import { get } from './mockAxios'

export function createMockConfigBackend () {
  // Just enough config for our purposes
  get('/api/config/', () => {
    return [200, {
      feedbackPossibleDays: 30,
    }]
  }, {
    requireAuth: false,
  })
}
