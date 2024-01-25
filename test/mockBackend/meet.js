import { get } from '>/mockBackend/mockAxios'

export function createMockMeetBackend () {
  // Just enough to step the errors
  get('/api/meet/rooms/', () => [200, []])
}
