import { useQuery } from '@tanstack/vue-query'

import api from '@/meet/api/meet'
import { useSocketEvents } from '@/utils/composables'
import { useQueryHelpers } from '@/utils/queryHelpers'

const QUERY_KEY_BASE = 'meet'
export const queryKeyRoomList = () => [QUERY_KEY_BASE, 'rooms', 'list']

export function useRoomListUpdater () {
  const { on } = useSocketEvents()
  const { updateOrInvalidateListEntry, deleteListEntry } = useQueryHelpers()
  on('meet:room', room => {
    updateOrInvalidateListEntry(queryKeyRoomList(), room)
  })
  on('meet:room_ended', room => {
    deleteListEntry(queryKeyRoomList(), room.id)
  })
}

export function useRoomListQuery () {
  const query = useQuery({
    queryKey: queryKeyRoomList(),
    queryFn: () => api.listRooms(),
    staleTime: Infinity, // use web sockets // TODO: check it still refreshes on returning to page...
  })
  return {
    ...query,
    rooms: query.data,
  }
}
