import { cursorPaginated } from '>/mockBackend/mockAxios'

import { db } from './index'

export function createMockHistoryBackend () {
  cursorPaginated(
    '/api/history/',
    // TODO: add filters
    () => db.history,
  )
}
