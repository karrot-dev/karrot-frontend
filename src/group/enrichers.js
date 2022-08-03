/* eslint-disable */

import { useStore } from 'vuex'
import { useCurrentGroupService } from '@/group/services'

export function useGroupEnricher () {
  const store = useStore()
  const { groupId: currentGroupId } = useCurrentGroupService()

  function enrichGroup (group) {
    // TODO: decouple from store
    const myApplicationPending = store.getters['applications/getMineInGroup'] && store.getters['applications/getMineInGroup'](group.id)

    return {
      ...group,
      _enrichSource: group,

      isCurrentGroup: group.id === currentGroupId.value,
      isPlayground: group.status === 'playground',
      isInactive: group.status === 'inactive',
      myApplicationPending,
      hasPhoto: group.photoUrls && group.photoUrls.fullSize,
    }
  }
  return enrichGroup
}

export function useCurrentGroupEnricher () {
  const store = useStore()
  return group => {
    // TODO: decouple from store
    // TODO: what about groups/enrich .. have to distinguish...
    // this one is a bit complex to reimplement here for now...
    return store.getters['currentGroup/enrich'](group)
  }
}
