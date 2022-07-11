<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->
=======
<template>
  <SidenavGroupUI
    :group-id="$store.getters['currentGroup/id']"
    :theme="$store.getters['currentGroup/theme']"
    :features="$store.getters['currentGroup/features']"
    :wall-unread-count="$store.getters['status/currentGroupWallUnreadCount']"
    :feedback-possible-count="$store.getters['status/currentGroupFeedbackPossibleCount']"
    :pending-application-count="$store.getters['status/currentGroupPendingApplicationCount']"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import SidenavGroupUI from './SidenavGroupUI'

export default {
  components: {
    SidenavGroupUI,
  },
}
</script>
