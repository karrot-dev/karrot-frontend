<template>
  <div>
    <div
      class="row items-center bg-white q-px-sm q-py-xs q-gutter-sm"
    >
      <QSelect
        v-model="status"
        :options="[
          { label: t('ISSUE.STATUS.ONGOING'), value: 'ongoing' },
          { label: t('ISSUE.STATUS.DECIDED'), value: 'decided' },
          { label: t('ISSUE.STATUS.CANCELLED'), value: 'cancelled' },
        ]"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />
    </div>
    <KNotice v-if="hasNoOngoing">
      <template #icon>
        <QIcon class="fas fa-bed" />
      </template>
      {{ $t('ISSUE.NO_ONGOING') }}
    </KNotice>
    <QInfiniteScroll v-bind="infiniteScroll">
      <QList
        class="bg-white q-mt-md"
        bordered
      >
        <IssueItem
          v-for="issue in issues"
          :key="issue.id"
          v-measure
          :issue="issue"
        />
      </QList>
      <template #loading>
        <KSpinner />
      </template>
    </QInfiniteScroll>
  </div>
</template>

<script setup>
import {
  QList,
  QIcon,
  QSelect,
  QInfiniteScroll,
} from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCurrentGroupService } from '@/group/services'
import { useIssueListQuery } from '@/issues/queries'
import { useQueryParams } from '@/utils/mixins/bindRoute'

import IssueItem from '@/issues/components/IssueItem.vue'
import KNotice from '@/utils/components/KNotice.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const { t } = useI18n()

const {
  groupId,
} = useCurrentGroupService()

const {
  status,
} = useQueryParams({ status: 'ongoing' })

const {
  issues,
  infiniteScroll,
  isFetching,
} = useIssueListQuery({ groupId, status })

const hasNoOngoing = computed(() => {
  return status.value === 'ongoing' && !isFetching.value && issues.value.length === 0
})
</script>
