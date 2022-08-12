<template>
  <GroupGalleryUI
    :my-groups="partitionedGroups.mine"
    :other-groups="partitionedGroups.other"
    :fetch-status="$store.getters['groups/fetchStatus']"
    :is-logged-in="$store.getters['auth/isLoggedIn']"
    :my-coordinates="$store.getters['geo/myCoordinates']"
    @preview="groupId => $router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } }).catch(() => {})"
    @visit="groupId => $router.push({ name: 'group', params: { groupId } }).catch(() => {})"
  />
</template>

<script setup>
import { computed } from 'vue'
import GroupGalleryUI from '@/groupInfo/components/GroupGalleryUI'

import { useGroupInfoService } from '@/groupInfo/services'
import { useApplicationListQuery } from '@/applications/queries'
import { useAuthService } from '@/authuser/services'

const { userId } = useAuthService()
const { groups } = useGroupInfoService()
const {
  applications,
} = useApplicationListQuery({ userId, status: 'pending' }, { keepPreviousData: true })

function byName (a, b) {
  return a.name.localeCompare(b.name)
}

// Puts ones with distance at the top in order of distance
// ... then ones without distance below, ordered by member count
function byDistanceOrMemberCount (a, b) {
  if (a.distance === null && b.distance === null) {
    return b.memberCount - a.memberCount
  }
  else if (a.distance === null) {
    return 1
  }
  else if (b.distance === null) {
    return -1
  }
  return a.distance - b.distance
}

const partitionedGroups = computed(() => {
  const applicationPending = []
  const mine = []
  const other = []

  groups.value.forEach(group => {
    if (applications.value.find(application => application.group === group.id)) {
      applicationPending.push(group)
    }
    else if (group.isMember) {
      mine.push(group)
    }
    else {
      other.push(group)
    }
  })

  applicationPending.sort(byName)
  mine.sort(byName)
  other.sort(byDistanceOrMemberCount)

  return {
    mine: [...applicationPending, ...mine],
    other,
  }
})
</script>
