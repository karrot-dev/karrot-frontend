<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
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
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import GroupSettings from '@/group/components/GroupSettings'

export default {
  components: {
    GroupSettings,
  },
}
</script>
