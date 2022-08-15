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
import { computed } from 'vue'

import {
  QTabs,
  QRouteTab,
  QBadge,
} from 'quasar'

import { useCurrentGroupService } from '@/group/services'
import { useI18n } from 'vue-i18n'

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
  ]
})
</script>
