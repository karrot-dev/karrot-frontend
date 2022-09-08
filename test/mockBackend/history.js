import { cursorPaginated } from '>/mockBackend/mockAxios'

export function createMockHistoryBackend () {
  cursorPaginated('/api/history/', () => [])
}
