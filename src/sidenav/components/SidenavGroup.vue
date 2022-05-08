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

<script>
import SidenavGroupUI from './SidenavGroupUI'

export default {
  components: {
    SidenavGroupUI,
  },
}
</script>
