<template>
  <div>
    <QTabs
      class="bg-white"
      align="left"
    >
      <QRouteTab
        v-for="(tab, idx) in tabs"
        :key="idx"
        :to="tab.to"
        :label="tab.label"
        exact
      >
        <QBadge
          v-if="tab.count"
          color="secondary"
          floating
        >
          {{ tab.count }}
        </QBadge>
      </QRouteTab>
    </QTabs>
    <RouterView />
  </div>
</template>

<script setup>
import {
  QTabs,
  QRouteTab,
  QBadge,
} from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCurrentGroupService } from '@/group/services'

const { t } = useI18n()
const { groupId } = useCurrentGroupService()

const tabs = computed(() => {
  const params = { groupId: groupId.value }
  return [
    {
      to: { name: 'groupEditDetails', params },
      label: t('GROUP.EDIT_DETAILS'),
    },
    {
      to: { name: 'groupEditActivityTypes', params },
      label: t('GROUP.EDIT_ACTIVITY_TYPES'),
    },
    {
      to: { name: 'groupEditPlaceTypes', params },
      label: t('GROUP.EDIT_PLACE_TYPES'),
    },
    {
      to: { name: 'groupEditPlaceStatuses', params },
      label: t('GROUP.EDIT_PLACE_STATUSES'),
    },
  ]
})
</script>
