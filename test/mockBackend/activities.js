import { db } from '>/mockBackend/index'
import { cursorPaginated } from '>/mockBackend/mockAxios'

export function createMockActivitiesBackend () {
  cursorPaginated(
    '/api/activities/',
    () => db.activities,
  )
}
