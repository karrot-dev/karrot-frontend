<template>
  <GroupSettings
    :group="group"
    :groups="$store.getters['groups/mine']"
    :status="$store.getters['unsubscribe/allEmailsPerGroupStatus']"
    @unsubscribe-all-emails="data => $store.dispatch('unsubscribe/allEmailsPerGroup', data)"
    @clear-unsubscribe-all-status="data => $store.dispatch('unsubscribe/clear', data)"
  />
</template>

<script setup>
import GroupSettings from '@/group/components/GroupSettings'
import { useCurrentGroupService } from '@/group/services'

const { group } = useCurrentGroupService()
</script>
