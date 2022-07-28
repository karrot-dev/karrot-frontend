import { defineService } from '@/utils/datastore/helpers'
import { useGroupInfoListQuery } from '@/groupInfo/queries'

export const useGroupInfoService = defineService(() => {
  // queries
  // TODO: filtering for active status?
  const { groups } = useGroupInfoListQuery()

  return {
    groups,
  }
})
