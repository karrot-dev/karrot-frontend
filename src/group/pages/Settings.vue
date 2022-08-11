<template>
  <GroupSettings
    :group="$store.getters['currentGroup/value']"
    :groups="$store.getters['groups/mine']"
    :status="$store.getters['unsubscribe/allEmailsPerGroupStatus']"
    :get-notification-type-status="$store.getters['currentGroup/getNotificationTypeStatus']"
    @change-notification-type="data => $store.dispatch('currentGroup/changeNotificationType', data)"
    @unsubscribe-all-emails="data => $store.dispatch('unsubscribe/allEmailsPerGroup', data)"
    @clear-unsubscribe-all-status="data => $store.dispatch('unsubscribe/clear', data)"
  />
</template>

<script setup>
import GroupSettings from '@/group/components/GroupSettings'
</script>
