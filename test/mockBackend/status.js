import { groupsForUser } from '>/mockBackend/groups'
import { ctx, db } from '>/mockBackend/index'

import { get } from './mockAxios'

export function createMockStatusBackend () {
  get('/api/status/', () => {
    const now = new Date()
    const groups = {}
    for (const group of groupsForUser(ctx.authUser)) {
      groups[group.id] = {
        feedbackPossibleCount: db.activities.filter(
          activity => (
            db.orm.places.get({ id: activity.place }).group === group.id &&
            activity.date[0] < now &&
            activity.feedbackDue > now
          ),
        ).length,
      }
    }

    return [200, {
      unseenConversationCount: 0,
      unseenThreadCount: 0,
      hasUnreadConversationsOrThreads: false,
      unseenNotificationCount: 0,
      groups,
      places: {},
    }]
  })
}
