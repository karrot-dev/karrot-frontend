<template>
  <div
    class="row items-center bg-white q-px-sm q-py-xs q-gutter-sm"
  >
    <QCheckbox
      v-model="onlyActive"
      label="Only active"
    />
    <QSpace />
    <QBtnToggle
      v-model="grid"
      :options="[
        {
          value: true,
          icon: 'fas fa-th-large',
          attrs: {
            'aria-label': 'Grid',
          }
        },
        {
          value: false,
          icon: 'fas fa-list',
          attrs: {
            'aria-label': 'Table',
          }
        },
      ]"
      flat
      size="sm"
      color="grey-4"
      toggle-color="grey"
      class="on-left"
    />
    <QBtn
      v-if="isEditor"
      color="secondary"
      icon="fas fa-plus"
      padding="8px"
      rounded
      size="md"
      :title="$t('BUTTON.CREATE')"
      :to="{ name: 'agreementCreate', params: { groupId } }"
    />
  </div>
  <QInfiniteScroll v-bind="infiniteScroll">
    <QTable
      :grid="grid"
      hide-pagination
      :loading="isLoading"
      :columns="columns"
      :rows="agreements"
      :pagination="{ rowsPerPage: 0 }"
      @row-click="(_, agreement) => open(agreement)"
    >
      <template #item="{ row: agreement }">
        <div
          class="col-12 col-sm-6 col-md-4"
        >
          <QCard
            class="cursor-pointer"
            @click="open(agreement)"
          >
            <QItem class="bg-grey-3">
              <QItemSection side>
                <QIcon
                  name="fas fa-handshake"
                  :color="getAgreementIsActive(agreement) ? 'green' : 'grey'"
                />
              </QItemSection>
              <QItemSection>
                <QItemLabel class="ellipsis">
                  <div class="">
                    {{ agreement.title }}
                  </div>
                </QItemLabel>
              </QItemSection>
            </QItem>
            <QCardSection class="limit-height">
              <Markdown :source="agreement.summary || agreement.content" />
            </QCardSection>
            <QSeparator />
            <QCardActions
              style="height: 42px"
            >
              <QChip
                v-if="getAgreementIsActive(agreement)"
                size="sm"
                square
                color="secondary"
                text-color="white"
              >
                Active
              </QChip>
              <QChip
                v-else
                size="sm"
                square
                color="grey"
                text-color="white"
              >
                Inactive
              </QChip>
              <QSpace />
              <QChip
                v-if="agreement.reviewAt"
                square
                size="sm"
              >
                Review date <strong class="q-pl-xs">{{ $d(agreement.reviewAt, 'yearMonthDayNumeric') }}</strong>
              </QChip>
            </QCardActions>
          </QCard>
        </div>
      </template>
    </QTable>
  </QInfiniteScroll>
</template>

<script setup>
import { useSessionStorage } from '@vueuse/core'
import {
  QTable,
  QSpace,
  QBtn,
  QBtnToggle,
  QToggle,
  QCard,
  QCardSection,
  QSeparator,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QCardActions,
  QChip,
  QInfiniteScroll,
  QCheckbox,
} from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { useAgreementHelpers } from '@/agreements/helpers'
import { useAgreementListQuery } from '@/agreements/queries'
import { useCurrentGroupService } from '@/group/services'

import Markdown from '@/utils/components/Markdown.vue'

const router = useRouter()

const { d } = useI18n()

const grid = useSessionStorage('agreements/grid', true)
const onlyActive = useSessionStorage('agreements/only-active', true)

// We don't want to pass "false" to backend, as that means "not active"
// null value means show all...
const active = computed(() => onlyActive.value || null)

const {
  groupId,
  isEditor,
} = useCurrentGroupService()
const {
  agreements,
  infiniteScroll,
  isLoading,
} = useAgreementListQuery(
  { groupId, active },
  { keepPreviousData: true },
)

const { getAgreementIsActive } = useAgreementHelpers()

function open (agreement) {
  router.push({ name: 'agreement', params: { agreementId: agreement.id } })
}

const columns = computed(() => {
  return [
    {
      name: 'title',
      label: 'Title',
      field: 'title',
      align: 'left',
    },
    {
      name: 'summary',
      label: 'Summary',
      field: agreement => agreement.summary || agreement.content, // TODO: limit, either here or in style...
      align: 'left',
      style: 'max-width: 200px; text-overflow: ellipsis; overflow: hidden;',
    },
    {
      name: 'activeFrom',
      label: 'Active From',
      field: agreement => d(agreement.activeFrom, 'yearMonthDayNumeric'),
      align: 'left',
    },
    {
      name: 'activeTo',
      label: 'Active To',
      field: agreement => agreement.activeTo && d(agreement.activeTo, 'yearMonthDayNumeric'),
      align: 'left',
    },
    {
      name: 'reviewAt',
      label: 'Review Date',
      field: agreement => agreement.reviewAt && d(agreement.reviewAt, 'yearMonthDayNumeric'),
      align: 'left',
    },
  ]
})
</script>

<style lang="sass">
.limit-height
  position: relative
  min-height: 140px
  max-height: 140px
  overflow-y: hidden
</style>
