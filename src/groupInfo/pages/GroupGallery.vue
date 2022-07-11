<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
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
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import GroupGalleryUI from '@/groupInfo/components/GroupGalleryUI'

export default {
  components: {
    GroupGalleryUI,
  },
}
</script>
