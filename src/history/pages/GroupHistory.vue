<template>
  <div>
    <div
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs"
    >
      <QSelect
        v-model="typus"
        :options="typusOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />
    </div>
    <QCard
      class="no-mobile-margin no-shadow grey-border"
    >
      <RandomArt
        v-if="$q.platform.is.desktop"
        :seed="groupId"
        type="circles"
      />
      <HistoryList
        class="padding-top"
        :history="history"
        :pending="isLoading"
        :can-fetch-past="hasNextPage"
        :fetch-past="() => fetchNextPage()"
      />
      <!-- TODO: what to do with fetch-past-status ? -->
    </QCard>
  </div>
</template>

<script setup>
import { QSelect, QCard } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCurrentGroupService } from '@/group/services'
import { useHistoryListQuery } from '@/history/queries'
import { useQueryParams } from '@/utils/mixins/bindRoute'

import HistoryList from '@/history/components/HistoryList'
import RandomArt from '@/utils/components/RandomArt'

const { t } = useI18n()

const { typus } = useQueryParams({
  typus: null,
})

const typusOptions = computed(() => [
  {
    label: t('HISTORY_FILTER.ALL'),
    value: null,
  },
  ...[
    'GROUP_CREATE',
    'GROUP_MODIFY',
    'GROUP_JOIN',
    'GROUP_LEAVE',
    'STORE_CREATE',
    'STORE_MODIFY',
    'STORE_DELETE',
    'ACTIVITY_CREATE',
    'ACTIVITY_MODIFY',
    'ACTIVITY_DELETE',
    'SERIES_CREATE',
    'SERIES_MODIFY',
    'SERIES_DELETE',
    'ACTIVITY_DONE',
    'ACTIVITY_JOIN',
    'ACTIVITY_LEAVE',
    'ACTIVITY_MISSED',
    'APPLICATION_DECLINED',
    'MEMBER_BECAME_EDITOR',
    'ACTIVITY_DISABLE',
    'ACTIVITY_ENABLE',
    'GROUP_LEAVE_INACTIVE',
    'GROUP_CHANGE_PHOTO',
    'GROUP_DELETE_PHOTO',
    'MEMBER_REMOVED',
    'ACTIVITY_TYPE_CREATE',
    'ACTIVITY_TYPE_MODIFY',
    'ACTIVITY_TYPE_DELETE',
    'USER_LOST_EDITOR_ROLE',
    'PLACE_TYPE_CREATE',
    'PLACE_TYPE_MODIFY',
    'PLACE_TYPE_DELETE',
    'AGREEMENT_CREATE',
    'AGREEMENT_MODIFY',
    'MEMBER_GOT_ROLE',
  ].map(typus => ({
    label: t(`HISTORY_FILTER.${typus}`),
    value: typus,
  })),
])

const { groupId } = useCurrentGroupService()
const {
  history,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useHistoryListQuery({
  groupId,
  typus,
})
</script>

<style scoped lang="sass">
body.mobile .art-overlay
  width: 100%
  height: 30px
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0) 100%)

.padding-top
  padding-top: 10px
</style>
