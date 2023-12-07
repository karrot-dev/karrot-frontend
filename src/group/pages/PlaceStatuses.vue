<template>
  <QTable
    ref="tableRef"
    flat
    :columns="columns"
    :rows="placeStatuses"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    @row-click="edit"
  >
    <template #top-left>
      <QToggle
        v-model="showArchived"
        :label="t('PLACE_TYPES.SHOW_ARCHIVED')"
      />
    </template>
    <template #top-right>
      <QBtn
        round
        color="green"
        icon="fas fa-plus"
        :title="t('PLACE_TYPES.ADD')"
        @click="create()"
      />
    </template>
    <template #body-cell="props">
      <QTd
        :props="props"
        :auto-width="props.col.name === 'status'"
      >
        {{ props.value }}
      </QTd>
    </template>
    <template #body-cell-handle="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon name="fa fa-bars" />
      </QTd>
    </template>
    <template #body-cell-colour="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon
          size="sm"
          :color="props.value"
          name="fa fa-circle"
        />
      </QTd>
    </template>
    <template #body-cell-visible="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon
          v-if="props.value"
          name="fas fa-check"
          color="positive"
        />
      </QTd>
    </template>
    <template #body-cell-isArchived="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QBadge
          :color="props.value ? 'grey' : 'green'"
        >
          {{ props.value ? t('LABELS.ARCHIVED') : t('LABELS.ACTIVE') }}
        </QBadge>
      </QTd>
    </template>
  </QTable>
</template>
<script setup>
import { generateKeyBetween } from 'fractional-indexing'
import { sortBy } from 'lodash'
import { QBadge, QBtn, QIcon, QTable, QTd, QToggle } from 'quasar'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCurrentGroupId } from '@/group/helpers'
import { usePlaceStatuses, usePlaceStatusHelpers } from '@/places/helpers'
import { useSavePlaceStatusMutation } from '@/places/mutations'
import { openDialog } from '@/utils/forms'
import { useSortableTable } from '@/utils/sortable'

import PlaceStatusForm from '@/group/components/PlaceStatusForm.vue'

const { t } = useI18n()

const { mutateAsync: save } = useSavePlaceStatusMutation()

const { getTranslatedName, getColorName } = usePlaceStatusHelpers()

const groupId = useCurrentGroupId()

const allPlaceStatuses = usePlaceStatuses(groupId)

const placeStatuses = computed(() => {
  return sortBy(allPlaceStatuses.value.filter(placeStatus => showArchived.value || !placeStatus.isArchived), ['order', 'id'])
})

const { tableRef, handleColumn } = useSortableTable({
  rows: placeStatuses,
  onUpdate: save,
})

const showArchived = ref(false)

const columns = computed(() => [
  handleColumn,
  {
    name: 'colour',
    field: row => getColorName(row),
    align: 'right',
    autoWidth: true,
  },
  {
    name: 'name',
    label: t('LABELS.NAME'),
    field: row => getTranslatedName(row),
    align: 'left',
    classes: 'text-weight-bold',
    autoWidth: true,
  },
  {
    name: 'description',
    label: t('LABELS.DESCRIPTION'),
    field: row => row.description,
    align: 'left',
    style: 'max-width: 200px',
    classes: 'ellipsis',
  },
  {
    name: 'visible',
    label: t('LABELS.VISIBLE'),
    field: row => row.isVisible,
    align: 'center',
  },
  showArchived.value && {
    name: 'isArchived',
    label: t('LABELS.STATUS'),
    field: row => row.isArchived,
    align: 'left',
    autoWidth: true,
  },
].filter(Boolean))

function generateNextOrder () {
  return generateKeyBetween(placeStatuses.value[placeStatuses.value.length - 1]?.order || null, null)
}

function create () {
  openDialog(PlaceStatusForm, {
    placeStatus: {
      name: undefined,
      colour: undefined,
      description: undefined,
      order: generateNextOrder(),
      isVisible: true,
    },
  })
}

function edit (_, placeStatus) {
  openDialog(PlaceStatusForm, { placeStatus })
}
</script>
