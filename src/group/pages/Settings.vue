<template>
  <GroupSettings
    :group="$store.getters['currentGroup/value']"
    :groups="$store.getters['groups/mineWithApplications']"
    :status="$store.getters['unsubscribe/allEmailsPerGroupStatus']"
    :get-notification-type-status="$store.getters['currentGroup/getNotificationTypeStatus']"
    @change-notification-type="data => $store.dispatch('currentGroup/changeNotificationType', data)"
    @select-group="data => $store.dispatch('currentGroup/select', data)"
    @unsubscribe-all-emails="data => $store.dispatch('unsubscribe/allEmailsPerGroup', data)"
    @clear-unsubscribe-all-status="data => $store.dispatch('unsubscribe/clear', data)"
  />
</template>

<script>
import GroupSettings from '@/group/components/GroupSettings'

export default {
  components: {
    GroupSettings,
  },
}
</script>
