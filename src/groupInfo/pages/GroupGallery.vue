<template>
  <GroupGalleryUI
    :my-groups="$store.getters['groups/mineWithApplications']"
    :other-groups="$store.getters['groups/other']"
    :fetch-status="$store.getters['groups/fetchStatus']"
    :is-logged-in="$store.getters['auth/isLoggedIn']"
    :my-coordinates="$store.getters['geo/myCoordinates']"
    @preview="groupId => $router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } }).catch(() => {})"
    @visit="groupId => $router.push({ name: 'group', params: { groupId } }).catch(() => {})"
  />
</template>

<script>
import GroupGalleryUI from '@/groupInfo/components/GroupGalleryUI'

export default {
  components: {
    GroupGalleryUI,
  },
}
</script>
